#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> vec(n);
    for(int i = 0; i < n; ++i) {
        std::cin >> vec[i];
    }
    for(const auto& val : vec) {
        std::cout << val << " ";
    }
    std::cout << std::endl;
    return 0;
}


// import java.util.Scanner;
// import java.util.ArrayList;

// public class Main {
//     public static void main(String[] args) {
//         Scanner scanner = new Scanner(System.in);
//         int n = scanner.nextInt();
//         ArrayList<Integer> vec = new ArrayList<>(n);
//         for (int i = 0; i < n; ++i) {
//             vec.add(scanner.nextInt());
//         }
//         for (int val : vec) {
//             System.out.print(val + " ");
//         }
//         System.out.println();
//         scanner.close();
//     }
// }