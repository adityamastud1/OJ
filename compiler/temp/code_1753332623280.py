n = int(input())
line = input().split()

# Automatically handle both formats:
# - "1 2 3 4 5"
# - or one number per line
vector = list(map(int, line))
while len(vector) < n:
    vector.append(int(input()))

# Example usage
print("Final vector is:", vector)

# Later string input example
some_string = input()
print("You entered string:", some_string)
