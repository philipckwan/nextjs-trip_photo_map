import Image from 'next/image';

export function DummyImage() {
  return (
    <>
      <Image src="/images/mac_background.png" alt="mac_background" width="1500" height="1500"/>
    </>
  );
}