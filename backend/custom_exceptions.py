class DBException(Exception):
    def __init__(self, message: str):
        self.message = message

class ServiceException(Exception):
    def __init__(self, message: str):
        self.message = message