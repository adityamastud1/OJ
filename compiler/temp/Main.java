import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = Integer.parseInt(scanner.nextLine());
        int[] vec = new int[n];

        String[] inputNumbers = scanner.nextLine().split(" ");
        for (int i = 0; i < n; i++) {
            vec[i] = Integer.parseInt(inputNumbers[i]);
        }

        for (int i = 0; i < n; i++) {
            System.out.print(vec[i] + " ");
        }
    }
}
