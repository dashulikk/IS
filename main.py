from database import Database
from salted_password import SaltedPassword
from service import Service

USERNAME = "test"
PASSWORD = "test"
STOCK = "GOOG"

db = Database()
service = Service(db)
"""
password_object = SaltedPassword(PASSWORD)

service.create_user(USERNAME, password_object.password_hash, password_object.salt)
"""
print(f"{USERNAME} exists: {service.user_exists(USERNAME)}")
print(f"{USERNAME} balance: {service.get_balance(USERNAME)}")
service.topup(USERNAME, 10)
print(f"{USERNAME} balance: {service.get_balance(USERNAME)}")
print(f"{STOCK} price: {service.stock_price(STOCK)}")