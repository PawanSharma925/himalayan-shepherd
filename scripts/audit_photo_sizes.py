"""Print source resolution and a sharpness score for every edited photo."""

from pathlib import Path

from PIL import Image, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "edited photos"


def sharpness(img: Image.Image) -> float:
    gray = img.convert("L")
    gray.thumbnail((1200, 1200))
    edges = gray.filter(ImageFilter.FIND_EDGES)
    return ImageStat.Stat(edges).var[0]


def main() -> None:
    for path in sorted(SOURCE.rglob("*.png")):
        with Image.open(path) as img:
            w, h = img.size
            score = sharpness(img)
        print(f"{w:>5}x{h:<5} sharp={score:7.1f}  {path.relative_to(SOURCE)}")


if __name__ == "__main__":
    main()
