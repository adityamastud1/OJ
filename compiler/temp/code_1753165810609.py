# Simple program to enter 2 elements and return their sum

def get_sum():
    a = float(input("Enter first number: "))
    b = float(input("Enter second number: "))
    return a + b

if __name__ == "__main__":
    result = get_sum()
    print("Sum:", result)