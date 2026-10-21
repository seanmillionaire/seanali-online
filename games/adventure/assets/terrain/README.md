# Terrain material assets

These optimized 1024px WebP maps are derived from Poly Haven's CC0 textures:

- Sand: https://polyhaven.com/a/aerial_beach_01
- Grass/soil: https://polyhaven.com/a/aerial_grass_rock
- Stone: https://polyhaven.com/a/aerial_rocks_02
- Weathered timber: https://polyhaven.com/a/wooden_planks
- Asphalt: https://polyhaven.com/a/aerial_asphalt_01

License: CC0, https://polyhaven.com/license

For each material, diff is color, nor_gl is the OpenGL tangent-space normal, and rough is roughness. Original PNGs came from https://dl.polyhaven.org/file/ph-assets/Textures/png/1k/ . They were resized as necessary and compressed to WebP (quality 88 for color, 92 for data maps). The loader uses sRGB only for color; normal/roughness maps remain linear. Materials fall back to procedural surfaces while maps load. Local copies remove the external texture dependency at play time.
