import { Algorithm } from "@/types/types";

export const algorithms: Algorithm[] = [
  {
    name: "Binary Search",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    type: "Divide and Conquer",
    imageUrl: "/algo-initial/binary-search.jpg",
    slug: "binary-search",
  },
  {
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    type: "Divide and Conquer",
    imageUrl: "/algo-initial/merge-sort.jpg",
    slug: "merge-sort",
  },
  {
    name: "Quick Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    type: "Divide and Conquer",
    imageUrl: "/algo-initial/quick-sort.png",
    slug: "quick-sort",
  },
];

export default algorithms;
