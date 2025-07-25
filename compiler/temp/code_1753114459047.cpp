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
    return 0;
}

