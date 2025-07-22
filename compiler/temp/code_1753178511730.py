# // #include<iostream>
# // #include<bits/stdc++.h>
# // using namespace std;

# // int main()
# // {
# //     int n;
# //     cin >> n;
# //     vector<int> arr(n);
# //     for(int i = 0; i < n; ++i) {
# //         cin >> arr[i];
# //     }
# //     for(int i = 0; i < n; ++i) {
# //         cout << arr[i] << " ";
# //     }
# //     cout << endl;
# //     return 0;
# // }




# import java.util.Scanner;
# import java.util.Vector;

# public class Main {
#     public static void main(String[] args) {
#         Scanner sc = new Scanner(System.in);
#         int n = sc.nextInt();
#         Vector<Integer> arr = new Vector<>();
#         for (int i = 0; i < n; ++i) {
#             arr.add(sc.nextInt());
#         }
#         for (int i = 0; i < n; ++i) {
#             System.out.print(arr.get(i) + " ");
#         }
#         System.out.println();
#     }
# }




 n = int(input())
 arr = []
 for _ in range(n):
     arr.append(int(input()))
 for num in arr:
     print(num, end=' ')
 print()
