#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> vec(n);
    for(int i = 0; i < n; ++i) {
        std::cin >> vec[i];
    }
    while(true){}
    for(const auto& val : vec) {
        std::cout << 1 << " ";
    }
    return 0;
}

