#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class ControleVendaAPITester:
    def __init__(self, base_url="https://controle-vendas-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.session_token = "test_session_1766496853344"  # From mongosh creation
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, description=""):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.session_token}'
        }

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        if description:
            print(f"   Description: {description}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_preview": response.text[:100] if not success else "OK"
            })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "response_preview": str(e)
            })
            return False, {}

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n" + "="*50)
        print("TESTING AUTHENTICATION ENDPOINTS")
        print("="*50)
        
        # Test get current user
        success, user_data = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200,
            description="Verify test session authentication"
        )
        
        if success:
            self.current_user = user_data
            return True
        return False

    def test_products_endpoints(self):
        """Test products CRUD operations"""
        print("\n" + "="*50)
        print("TESTING PRODUCTS ENDPOINTS")
        print("="*50)
        
        # Get all products (initially empty)
        self.run_test(
            "Get All Products",
            "GET",
            "products",
            200,
            description="List all products for user"
        )
        
        # Create a test product
        test_product = {
            "name": "Produto Teste",
            "barcode": "123456789",
            "purchase_price": 50.0,
            "sale_price": 75.0,
            "currency": "MZN"
        }
        
        success, product_data = self.run_test(
            "Create Product",
            "POST",
            "products",
            200,
            data=test_product,
            description="Create new product"
        )
        
        if success and 'product_id' in product_data:
            product_id = product_data['product_id']
            
            # Get specific product
            self.run_test(
                "Get Product by ID",
                "GET",
                f"products/{product_id}",
                200,
                description=f"Get product {product_id}"
            )
            
            # Update product
            updated_product = {
                "name": "Produto Teste Atualizado",
                "barcode": "123456789",
                "purchase_price": 55.0,
                "sale_price": 80.0,
                "currency": "MZN"
            }
            
            self.run_test(
                "Update Product",
                "PUT",
                f"products/{product_id}",
                200,
                data=updated_product,
                description=f"Update product {product_id}"
            )
            
            # Get product by barcode
            self.run_test(
                "Get Product by Barcode",
                "GET",
                f"products/barcode/123456789",
                200,
                description="Find product by barcode"
            )
            
            return product_id
        
        return None

    def test_movements_endpoints(self, product_id):
        """Test stock movements endpoints"""
        print("\n" + "="*50)
        print("TESTING STOCK MOVEMENTS ENDPOINTS")
        print("="*50)
        
        if not product_id:
            print("⚠️  Skipping movements tests - no product available")
            return
        
        # Get all movements (initially empty)
        self.run_test(
            "Get All Movements",
            "GET",
            "movements",
            200,
            description="List all stock movements"
        )
        
        # Create stock entry
        entry_movement = {
            "product_id": product_id,
            "type": "entrada",
            "quantity": 10,
            "note": "Entrada inicial de teste"
        }
        
        self.run_test(
            "Create Stock Entry",
            "POST",
            "movements",
            200,
            data=entry_movement,
            description="Add stock entry movement"
        )
        
        # Create stock exit
        exit_movement = {
            "product_id": product_id,
            "type": "saida",
            "quantity": 3,
            "note": "Saída de teste"
        }
        
        self.run_test(
            "Create Stock Exit",
            "POST",
            "movements",
            200,
            data=exit_movement,
            description="Add stock exit movement"
        )
        
        # Get movements for specific product
        self.run_test(
            "Get Product Movements",
            "GET",
            f"movements?product_id={product_id}",
            200,
            description=f"Get movements for product {product_id}"
        )

    def test_currency_endpoints(self):
        """Test currency conversion endpoints"""
        print("\n" + "="*50)
        print("TESTING CURRENCY ENDPOINTS")
        print("="*50)
        
        # Test currency conversion
        conversion_request = {
            "amount": 100.0,
            "from_currency": "MZN",
            "to_currency": "USD"
        }
        
        self.run_test(
            "Convert Currency",
            "POST",
            "currency/convert",
            200,
            data=conversion_request,
            description="Convert MZN to USD"
        )
        
        # Test get exchange rates
        self.run_test(
            "Get Exchange Rates",
            "GET",
            "currency/rates/MZN",
            200,
            description="Get exchange rates for MZN"
        )

    def test_reports_endpoints(self):
        """Test reports endpoints"""
        print("\n" + "="*50)
        print("TESTING REPORTS ENDPOINTS")
        print("="*50)
        
        self.run_test(
            "Get Reports Summary",
            "GET",
            "reports/summary",
            200,
            description="Get dashboard summary data"
        )

    def test_support_endpoints(self):
        """Test support endpoints"""
        print("\n" + "="*50)
        print("TESTING SUPPORT ENDPOINTS")
        print("="*50)
        
        support_message = {
            "subject": "Teste de Suporte",
            "message": "Esta é uma mensagem de teste do sistema de suporte."
        }
        
        self.run_test(
            "Send Support Message",
            "POST",
            "support/contact",
            200,
            data=support_message,
            description="Send support contact message"
        )

    def test_cleanup(self, product_id):
        """Clean up test data"""
        print("\n" + "="*50)
        print("CLEANING UP TEST DATA")
        print("="*50)
        
        if product_id:
            self.run_test(
                "Delete Test Product",
                "DELETE",
                f"products/{product_id}",
                200,
                description=f"Delete test product {product_id}"
            )

def main():
    print("🚀 Starting Controle de Venda API Tests")
    print("="*60)
    
    tester = ControleVendaAPITester()
    
    # Test authentication first
    if not tester.test_auth_endpoints():
        print("\n❌ Authentication failed - stopping tests")
        return 1
    
    # Test all endpoints
    tester.test_products_endpoints()
    
    # Get a product ID for movement tests
    product_id = None
    for result in tester.test_results:
        if result["name"] == "Create Product" and result["success"]:
            # We need to extract product_id from the actual response
            # For now, we'll create another product for movements
            break
    
    # Create a product specifically for movements testing
    test_product = {
        "name": "Produto para Movimentos",
        "barcode": "987654321",
        "purchase_price": 30.0,
        "sale_price": 45.0,
        "currency": "MZN"
    }
    
    success, product_data = tester.run_test(
        "Create Product for Movements",
        "POST",
        "products",
        200,
        data=test_product,
        description="Create product for movement testing"
    )
    
    if success and 'product_id' in product_data:
        product_id = product_data['product_id']
    
    tester.test_movements_endpoints(product_id)
    tester.test_currency_endpoints()
    tester.test_reports_endpoints()
    tester.test_support_endpoints()
    
    # Clean up
    tester.test_cleanup(product_id)
    
    # Print final results
    print("\n" + "="*60)
    print("FINAL TEST RESULTS")
    print("="*60)
    print(f"📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"📈 Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    # Print failed tests
    failed_tests = [r for r in tester.test_results if not r["success"]]
    if failed_tests:
        print(f"\n❌ Failed tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   - {test['name']}: {test['response_preview']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())