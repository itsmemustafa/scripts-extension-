import os
import math
import zlib
import struct

def write_png(buf, width, height):
    # buf is RGBA bytes (width * height * 4)
    # PNG requires scanline format: filter byte (0) followed by RGBA pixels
    scanlines = b""
    for y in range(height):
        scanlines += b"\x00"  # Filter type 0
        scanlines += buf[y * width * 4 : (y + 1) * width * 4]
    
    # signature
    png = b"\x89PNG\r\n\x1a\n"
    
    # IHDR chunk
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png += struct.pack(">I", 13) + b"IHDR" + ihdr_data + struct.pack(">I", zlib.crc32(b"IHDR" + ihdr_data))
    
    # IDAT chunk
    idat_data = zlib.compress(scanlines)
    png += struct.pack(">I", len(idat_data)) + b"IDAT" + idat_data + struct.pack(">I", zlib.crc32(b"IDAT" + idat_data))
    
    # IEND chunk
    png += struct.pack(">I", 0) + b"IEND" + struct.pack(">I", zlib.crc32(b"IEND"))
    return png

def in_triangle(p, p1, p2, p3):
    def sign(a, b, c):
        return (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1])
    d1 = sign(p, p1, p2)
    d2 = sign(p, p2, p3)
    d3 = sign(p, p3, p1)
    has_neg = (d1 < 0) or (d2 < 0) or (d3 < 0)
    has_pos = (d1 > 0) or (d2 > 0) or (d3 > 0)
    return not (has_neg and has_pos)

def get_rounded_rect_alpha(x, y, S):
    margin = S * 0.08
    R = S * 0.22
    cx_min = margin + R
    cx_max = S - 1 - margin - R
    cy_min = margin + R
    cy_max = S - 1 - margin - R
    
    def is_inside(px, py):
        if px < cx_min and py < cy_min:
            return (px - cx_min)**2 + (py - cy_min)**2 <= R**2
        if px > cx_max and py < cy_min:
            return (px - cx_max)**2 + (py - cy_min)**2 <= R**2
        if px < cx_min and py > cy_max:
            return (px - cx_min)**2 + (py - cy_max)**2 <= R**2
        if px > cx_max and py > cy_max:
            return (px - cx_max)**2 + (py - cy_max)**2 <= R**2
        return margin <= px <= S - 1 - margin and margin <= py <= S - 1 - margin

    # 4x4 supersampling
    inside_count = 0
    for sy in range(4):
        for sx in range(4):
            px = x + (sx + 0.5) / 4.0
            py = y + (sy + 0.5) / 4.0
            if is_inside(px, py):
                inside_count += 1
    return inside_count / 16.0

def get_airplane_alpha(x, y, S):
    rx = (x - S/2.0) / (S/2.0)
    ry = (y - S/2.0) / (S/2.0)
    
    # Vertices
    p1 = (0.35, -0.35)  # Front tip
    p2 = (-0.35, 0.05)  # Left wing
    p3 = (-0.08, 0.08)  # Tail indent
    p4 = (-0.05, 0.35)  # Right wing
    
    # 4x4 supersampling
    inside_count = 0
    for sy in range(4):
        for sx in range(4):
            spx = rx + (sx + 0.5) / (2.0 * S)
            spy = ry + (sy + 0.5) / (2.0 * S)
            if in_triangle((spx, spy), p1, p2, p3) or in_triangle((spx, spy), p1, p3, p4):
                inside_count += 1
    return inside_count / 16.0

def generate_icon(size):
    buf = bytearray()
    # Colors
    # bg = #143038 (RGB: 20, 48, 56)
    # fg = #F2994A (RGB: 242, 153, 74)
    for y in range(size):
        for x in range(size):
            bg_a = get_rounded_rect_alpha(x, y, size)
            fg_a = get_airplane_alpha(x, y, size)
            
            # Blend colors
            r = int(20 * (1.0 - fg_a) + 242 * fg_a)
            g = int(48 * (1.0 - fg_a) + 153 * fg_a)
            b = int(56 * (1.0 - fg_a) + 74 * fg_a)
            a = int(255 * bg_a)
            
            buf.extend([r, g, b, a])
    return write_png(bytes(buf), size, size)

def main():
    os.makedirs("icons", exist_ok=True)
    sizes = [16, 48, 128]
    for size in sizes:
        filename = f"icons/icon{size}.png"
        print(f"Generating {filename}...")
        png_data = generate_icon(size)
        with open(filename, "wb") as f:
            f.write(png_data)
    print("All icons generated successfully!")

if __name__ == "__main__":
    main()
