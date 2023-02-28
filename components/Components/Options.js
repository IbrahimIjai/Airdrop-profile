import styles from "./General.module.css";
export default function Options({ options, view, setView }) {
  return (
    <aside className={styles.Options}>
      {options.map((option, i) => (
        <div
          className={view === i ? styles.active : styles.inActive}
          key={option}
          onClick={() => setView(i)}
        >
          {option}
        </div>
      ))}
    </aside>
  );
}
