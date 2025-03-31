
interface Window {
  jotformEmbedHandler: (selector: string, domain: string) => void;
  parent: {
    scrollTo: (x: number, y: number) => void;
  };
}
