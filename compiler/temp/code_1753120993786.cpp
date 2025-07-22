#include<iostream>
#include<bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
#include<stdio.h>
#define ll long long int
#define IOS ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define endl << endl
#define ff first
#define ss second
#define vi vector<ll>
#define F(i, a, b) for (ll i = a; i < b; i++)
#define RF(i, a, b) for (ll i = a-1; i >= b; i--)
#define pb(x) push_back(x)
#define mp(x, y) make_pair(x, y)
#define MOD 1000000007
#define all(v) v.begin(), v.end()
#define putinvec(v, x) ll x; cin >> x; v.push_back(x)
using namespace std;
#define loopa queue<ll>q; F(idl, 0, 3){F(j, 0, 3)q.push(j);}
using namespace __gnu_pbds;
typedef tree<int, null_type, less<int>, rb_tree_tag, tree_order_statistics_node_update> ordered_set;
ll fact(ll n){
    ll a=1;
    if(n==0){
        return 1;
    }
    for(ll i=n;i>1;i--){
        a=(a*i);
    }
    return a;
}

// Function to generate prime numbers between start and end
vector<ll> generate_primes(ll start, ll end) {
    vector<ll> primes;
    ll aop=2;
    for (ll num = max(aop, start); num <= end; ++num) {
        bool is_prime = true;
        for (ll i = 2; i * i <= num; ++i) {
            if (num % i == 0) {
                is_prime = false;
                break;
            }
        }
        if (is_prime) {
            primes.push_back(num);
        }
    }
    return primes;
}

// Function to check if a number is prime
bool is_prime(ll num) {
    if (num < 2) return false;
    for (ll i = 2; i * i <= num; ++i) {
        if (num % i == 0) {
            return false;
        }
    }
    return true;
}

// Function to calculate the greatest common divisor (GCD)
ll gcd(ll a, ll b) {
    return b == 0 ? a : gcd(b, a % b);
}

// Function to calculate the least common multiple (LCM)
ll lcm(ll a, ll b) {
    return (a * b) / gcd(a, b);
}
struct CustomHash {
    static uint64_t splitmix64(uint64_t x) {
       x += 0x9e3779b97f4a7c15;
       x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
       x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
       return x ^ (x >> 31);
    }

    size_t operator()(ll x) const {
       static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
       return splitmix64(x + FIXED_RANDOM);
    }
};
int main()
{
  IOS;
  int t;
  cin >> t;
  for(int qwe=0; qwe<t; qwe++){
    ll n; cin >> n;
    vi a(n);
    F(i, 0, n){cin >> a[i];}
    for(auto it:a){
        cout << it << " ";
    }cout endl;
  }
     return 0;
}