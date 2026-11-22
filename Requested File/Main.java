import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Graph g = new Graph();

        int n = sc.nextInt(); // jumlah vertex
        int m = sc.nextInt(); // jumlah jalan
        int q = sc.nextInt(); // jumlah query

        // Baca N vertex sesuai urutan input
        for (int i = 0; i < n; i++) {
            char v = sc.next().charAt(0);
            g.addVertex(v);
        }

        // TODO 1: baca M jalan, masing-masing "a b bobot",
        //         lalu masukkan ke graph dengan g.addAdjList(...)


        // Cetak hasil BFS
        System.out.print("BFS : ");
        g.bfs();

        // TODO 2: untuk setiap Q query "a b":
        //         - baca a dan b
        //         - cetak label "Jalur Terbaik dari a dan b : " (tanpa baris baru)
        //         - panggil g.bestRoute(a, b)


        sc.close();
    }
}