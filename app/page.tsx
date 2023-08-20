import styles from "./page.module.css";
// import dynamic from "next/dynamic";
import ThreeRenderer from "@/components/three/ThreeRenderer";

// const ThreeRenderer = dynamic(
//   () => import("@/components/three/ThreeRenderer"),
//   { ssr: false, loading: () => <p>Loading...</p> }
// );

export default function Home() {
  return (
    <div>
      <ThreeRenderer />
    </div>
  );
}
