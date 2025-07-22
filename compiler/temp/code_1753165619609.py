# Take input from the user and print the array

# Read input as a space-separated string
input_str = input("Enter array elements separated by space: ")

# Convert input string to a list of integers
arr = list(map(int, input_str.split()))

# Print the array
print(arr)