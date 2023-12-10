import Image from "next/image";

export default async function Home() {
  return (
    <main>
      <div style={{width: '100%', aspectRatio: 'auto'}}>
        <Image src="logo.svg" alt="logo" fill />
        <Image src="logo_title.svg" alt="touyou" fill />
      </div>
      <div>
        Under Construction...
        <br />
        <a href="https://touyou.github.io" target="_blank" rel="noreferrer">
          大学時代のサイト
        </a>
      </div>
      <footer>Copyrights © 2015- touyou. All Rights Reserved.</footer>
    </main>
  );
};

export const dynamic = 'force-dynamic'
