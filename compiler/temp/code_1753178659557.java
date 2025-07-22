


import java.util.Scanner;
import java.util.Vector;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Vector<Integer> arr = new Vector<>();
        for (int i = 0; i < n; ++i) {
            arr.add(sc.nextInt());
        }
        for (int i = 0; i < n; ++i) {
            System.out.print(arr.get(i) + " ");
        }
        System.out.println();
    }
}


