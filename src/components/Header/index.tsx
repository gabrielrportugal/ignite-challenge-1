import styles from './header.module.scss';

import Logo from '../Icons/logo';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <Logo />
    </header>
  );
}
