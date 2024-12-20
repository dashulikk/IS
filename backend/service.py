from custom_exceptions import ServiceException
from stock_info import get_stock_price
from database import Database


class Service:
    def __init__(self, db: Database):
        self.db = db

    def user_exists(self, username: str) -> bool:
        return self.db.user_exists(username)

    def get_user_password_and_salt(self, username: str) -> tuple[str, str]:
        query_result = self.db.get_user_password_and_salt(username)
        return query_result[0][0], query_result[0][1]

    def create_user(self, username: str, hashed_password_hex: str, salt_hex: str) -> None:
        self.db.create_user(username, hashed_password_hex, salt_hex)

    def get_balance(self, username: str) -> float:
        query_result = self.db.get_balance(username)
        return query_result[0][0]

    def topup(self, username: str, amount: float) -> None:
        if amount <= 0:
            raise ServiceException(f"Amount has to be positive. Amount provided: {amount}")

        self.db.topup(username, amount)

    def get_portfolio(self, username: str) -> dict[str, float]:
        return self.db.get_portfolio(username)

    @staticmethod
    def _calculate_fee(total: float) -> float:
        return total * 0.001  # 0.1% of the total

    @staticmethod
    def stock_price(stock: str) -> float:
        return get_stock_price(stock)

    def buy_stock(self, username: str, stock: str, amount: float, commit=True) -> None:
        if amount <= 0:
            raise ServiceException(f"Amount has to be positive. Amount provided: {amount}")

        stock_price = Service.stock_price(stock)

        total = stock_price * amount

        fee = self._calculate_fee(total)
        self.db.buy_stock(username, stock, amount, total, fee, commit=commit)

    def sell_stock(self, username: str, stock: str, amount: float, commit=True) -> None:
        if amount <= 0:
            raise ServiceException(f"Amount has to be positive. Amount provided: {amount}")

        stock_price = Service.stock_price(stock)

        total = stock_price * amount

        fee = self._calculate_fee(total)
        self.db.sell_stock(username, stock, amount, total, fee, commit=commit)
