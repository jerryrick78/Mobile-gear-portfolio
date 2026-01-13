import requests
import sys
import json
from datetime import datetime

class MobileGearAPITester:
    def __init__(self, base_url="https://mobile-gear-20.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.created_product_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.text else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text}")
                except:
                    pass
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_signup(self):
        """Test user signup"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@example.com",
            "password": "testpass123"
        }
        
        success, response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup",
            200,
            data=test_user
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"   User ID: {self.user_id}")
            return True
        return False

    def test_login(self):
        """Test user login with existing credentials"""
        login_data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_get_me(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_get_products(self):
        """Test get all products"""
        success, response = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )
        
        if success:
            print(f"   Found {len(response)} products")
        return success

    def test_get_products_with_filters(self):
        """Test product filtering"""
        # Test category filter
        success1, _ = self.run_test(
            "Get Products by Category",
            "GET",
            "products?category=Cases & Covers",
            200
        )
        
        # Test search filter
        success2, _ = self.run_test(
            "Search Products",
            "GET",
            "products?search=case",
            200
        )
        
        # Test price filter
        success3, _ = self.run_test(
            "Filter Products by Price",
            "GET",
            "products?min_price=10&max_price=50",
            200
        )
        
        return success1 and success2 and success3

    def test_create_product(self):
        """Test creating a new product (admin)"""
        product_data = {
            "name": "Test Mobile Case",
            "description": "A test mobile case for testing purposes",
            "price": 29.99,
            "category": "Cases & Covers",
            "image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
            "stock": 50
        }
        
        success, response = self.run_test(
            "Create Product (Admin)",
            "POST",
            "admin/products",
            200,
            data=product_data
        )
        
        if success and 'id' in response:
            self.created_product_id = response['id']
            print(f"   Created product ID: {self.created_product_id}")
        return success

    def test_get_single_product(self):
        """Test getting a single product"""
        if not self.created_product_id:
            print("❌ Skipping - No product ID available")
            return False
            
        success, response = self.run_test(
            "Get Single Product",
            "GET",
            f"products/{self.created_product_id}",
            200
        )
        return success

    def test_update_product(self):
        """Test updating a product (admin)"""
        if not self.created_product_id:
            print("❌ Skipping - No product ID available")
            return False
            
        update_data = {
            "name": "Updated Test Mobile Case",
            "price": 39.99
        }
        
        success, response = self.run_test(
            "Update Product (Admin)",
            "PUT",
            f"admin/products/{self.created_product_id}",
            200,
            data=update_data
        )
        return success

    def test_cart_operations(self):
        """Test cart operations"""
        if not self.created_product_id:
            print("❌ Skipping cart tests - No product ID available")
            return False
            
        # Get empty cart
        success1, _ = self.run_test(
            "Get Empty Cart",
            "GET",
            "cart",
            200
        )
        
        # Add item to cart
        cart_item = {
            "product_id": self.created_product_id,
            "quantity": 2
        }
        
        success2, _ = self.run_test(
            "Add Item to Cart",
            "POST",
            "cart",
            200,
            data=cart_item
        )
        
        # Get cart with items
        success3, response = self.run_test(
            "Get Cart with Items",
            "GET",
            "cart",
            200
        )
        
        # Remove item from cart
        success4, _ = self.run_test(
            "Remove Item from Cart",
            "DELETE",
            f"cart/{self.created_product_id}",
            200
        )
        
        # Clear cart
        success5, _ = self.run_test(
            "Clear Cart",
            "DELETE",
            "cart",
            200
        )
        
        return success1 and success2 and success3 and success4 and success5

    def test_order_operations(self):
        """Test order operations"""
        if not self.created_product_id:
            print("❌ Skipping order tests - No product ID available")
            return False
            
        # First add item to cart
        cart_item = {
            "product_id": self.created_product_id,
            "quantity": 1
        }
        
        self.run_test("Add Item for Order", "POST", "cart", 200, data=cart_item)
        
        # Create order
        order_data = {
            "items": [{"product_id": self.created_product_id, "quantity": 1}],
            "total": 39.99,
            "shipping_address": {
                "name": "Test User",
                "email": "test@example.com",
                "phone": "1234567890",
                "address": "123 Test St",
                "city": "Test City",
                "zipCode": "12345",
                "country": "Test Country"
            }
        }
        
        success1, _ = self.run_test(
            "Create Order",
            "POST",
            "orders",
            200,
            data=order_data
        )
        
        # Get orders
        success2, _ = self.run_test(
            "Get User Orders",
            "GET",
            "orders",
            200
        )
        
        return success1 and success2

    def test_delete_product(self):
        """Test deleting a product (admin)"""
        if not self.created_product_id:
            print("❌ Skipping - No product ID available")
            return False
            
        success, _ = self.run_test(
            "Delete Product (Admin)",
            "DELETE",
            f"admin/products/{self.created_product_id}",
            200
        )
        return success

    def test_unauthorized_access(self):
        """Test unauthorized access to protected endpoints"""
        # Temporarily remove token
        original_token = self.token
        self.token = None
        
        success1, _ = self.run_test(
            "Unauthorized Cart Access",
            "GET",
            "cart",
            401
        )
        
        success2, _ = self.run_test(
            "Unauthorized Admin Access",
            "POST",
            "admin/products",
            401,
            data={"name": "test"}
        )
        
        # Restore token
        self.token = original_token
        return success1 and success2

def main():
    print("🚀 Starting Mobile Gear E-commerce API Tests")
    print("=" * 50)
    
    tester = MobileGearAPITester()
    
    # Test sequence
    tests = [
        ("User Authentication", [
            tester.test_signup,
            tester.test_get_me,
        ]),
        ("Product Management", [
            tester.test_get_products,
            tester.test_get_products_with_filters,
            tester.test_create_product,
            tester.test_get_single_product,
            tester.test_update_product,
        ]),
        ("Cart Operations", [
            tester.test_cart_operations,
        ]),
        ("Order Management", [
            tester.test_order_operations,
        ]),
        ("Security", [
            tester.test_unauthorized_access,
        ]),
        ("Cleanup", [
            tester.test_delete_product,
        ])
    ]
    
    for category, test_functions in tests:
        print(f"\n📋 {category} Tests")
        print("-" * 30)
        
        for test_func in test_functions:
            try:
                test_func()
            except Exception as e:
                print(f"❌ Test failed with exception: {str(e)}")
                tester.tests_run += 1
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())