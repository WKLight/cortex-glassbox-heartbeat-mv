# -*- coding: utf-8 -*-
"""
Blender 5.2 EEVEE Next Cinema Macro Builder for `B3D_08_glasskey` (39.20 - 41.28s, 125 frames @ 60fps)
"Frosted-Sapphire Sculpted `ねえ` Keycap Cluster & Concentric Photonic Ripple Actuation"
"""
import bpy
import bmesh
import math
import os
import sys
import time
from mathutils import Vector, Matrix

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.environ.get("CORTEX_B3D08_DIR", r"F:\cortex_v6_3d\B3D_08_glasskey" if os.path.exists("F:\\") else os.path.join(ROOT_DIR, "v6_3d", "B3D_08_glasskey"))
JP_FONT_PATH = r"C:\Windows\Fonts\YuGothB.ttc"
DUR = 2.08
FPS = 60


def clamp(v, lo=0.0, hi=1.0):
    return max(lo, min(hi, v))


def lerp(a, b, u):
    return a + (b - a) * u


def smoothstep(u):
    u = clamp(u)
    return u * u * (3.0 - 2.0 * u)


def ease_out_expo(u):
    u = clamp(u)
    return 1.0 if u >= 1.0 else 1.0 - math.pow(2.0, -10.0 * u)


def ease_in_out_cubic(u):
    u = clamp(u)
    return 4.0 * u * u * u if u < 0.5 else 1.0 - math.pow(-2.0 * u + 2.0, 3.0) / 2.0


def add_bevel(obj, width=0.035, segments=3):
    mod = obj.modifiers.new("Bevel", 'BEVEL')
    mod.width = width
    mod.segments = segments
    mod.limit_method = 'ANGLE'
    mod.angle_limit = math.radians(26)
    for p in obj.data.polygons:
        p.use_smooth = True
    return obj


def make_sculpted_keycap(name, w_bot=1.82, w_top=1.36, h=0.78, scoop=0.085, mat=None):
    bm = bmesh.new()
    nx, ny = 10, 10
    grid_top = []
    for iy in range(ny + 1):
        row = []
        vy = (iy / ny - 0.5) * w_top
        ny_norm = (iy / ny - 0.5) * 2.0
        for ix in range(nx + 1):
            vx = (ix / nx - 0.5) * w_top
            nx_norm = (ix / nx - 0.5) * 2.0
            r2 = min(1.0, nx_norm * nx_norm + ny_norm * ny_norm)
            vz = h - scoop * (1.0 - r2)
            row.append(bm.verts.new((vx, vy, vz)))
        grid_top.append(row)

    for iy in range(ny):
        for ix in range(nx):
            bm.faces.new((grid_top[iy][ix], grid_top[iy][ix + 1], grid_top[iy + 1][ix + 1], grid_top[iy + 1][ix]))

    perim_top = []
    for ix in range(nx):
        perim_top.append(grid_top[0][ix])
    for iy in range(ny):
        perim_top.append(grid_top[iy][nx])
    for ix in range(nx, 0, -1):
        perim_top.append(grid_top[ny][ix])
    for iy in range(ny, 0, -1):
        perim_top.append(grid_top[iy][0])

    scale_flare = w_bot / w_top
    perim_bot = [bm.verts.new((vt.co.x * scale_flare, vt.co.y * scale_flare, 0.0)) for vt in perim_top]

    n_p = len(perim_top)
    for i in range(n_p):
        ni = (i + 1) % n_p
        bm.faces.new((perim_bot[i], perim_bot[ni], perim_top[ni], perim_top[i]))

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name + "_Mesh")
    bm.to_mesh(me)
    bm.free()

    obj = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(obj)
    for p in obj.data.polygons:
        p.use_smooth = True
    if mat:
        obj.data.materials.append(mat)
    add_bevel(obj, width=0.042, segments=3)
    return obj


def create_ring_mesh(name, outer_r, inner_r, depth, segs=96, mat=None):
    bm = bmesh.new()
    top_out, top_in, bot_out, bot_in = [], [], [], []
    hz = depth * 0.5
    for i in range(segs):
        a = (i / segs) * math.tau
        ca, sa = math.cos(a), math.sin(a)
        top_out.append(bm.verts.new((ca * outer_r, sa * outer_r, hz)))
        top_in.append(bm.verts.new((ca * inner_r, sa * inner_r, hz)))
        bot_out.append(bm.verts.new((ca * outer_r, sa * outer_r, -hz)))
        bot_in.append(bm.verts.new((ca * inner_r, sa * inner_r, -hz)))
    for i in range(segs):
        ni = (i + 1) % segs
        bm.faces.new((top_out[i], top_out[ni], top_in[ni], top_in[i]))
        bm.faces.new((bot_in[i], bot_in[ni], bot_out[ni], bot_out[i]))
        bm.faces.new((top_out[ni], top_out[i], bot_out[i], bot_out[ni]))
        bm.faces.new((top_in[i], top_in[ni], bot_in[ni], bot_in[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name + "_Mesh")
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(obj)
    for p in obj.data.polygons:
        p.use_smooth = True
    if mat:
        obj.data.materials.append(mat)
    return obj


def make_3d_text(name, body, size, extrude, mat, vfont=None):
    cu = bpy.data.curves.new(name=name + "_Curve", type='FONT')
    cu.body = body
    cu.size = size
    cu.extrude = extrude
    cu.bevel_depth = 0.0
    cu.align_x = 'CENTER'
    cu.align_y = 'CENTER'
    if vfont is not None:
        cu.font = vfont
    obj = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(obj)
    if mat:
        obj.data.materials.append(mat)
    return obj


def build_scene(width=1920, height=1080, samples=20):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.resolution_x = width
    sc.render.resolution_y = height
    sc.render.resolution_percentage = 100
    sc.render.fps = FPS
    sc.render.image_settings.file_format = 'JPEG'
    sc.render.image_settings.quality = 95
    sc.render.image_settings.color_mode = 'RGB'

    sc.view_settings.view_transform = 'AgX'
    try:
        sc.view_settings.look = 'AgX - Punchy'
    except Exception:
        sc.view_settings.look = 'None'
    sc.view_settings.exposure = 0.08

    ee = sc.eevee
    ee.taa_render_samples = samples
    ee.use_raytracing = True
    ee.gi_diffuse_bounces = 2
    ee.shadow_ray_count = 2

    # Clean Studio World
    w = bpy.data.worlds.new("GlassKeyWorld")
    sc.world = w
    nt = w.node_tree
    nt.nodes.clear()
    out_w = nt.nodes.new('ShaderNodeOutputWorld')
    tc = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(tc.outputs['Generated'], sep.inputs['Vector'])
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = -0.2
    mr.inputs['From Max'].default_value = 0.75
    mr.clamp = True
    nt.links.new(sep.outputs['Z'], mr.inputs['Value'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (0.005, 0.008, 0.015, 1.0)
    ramp.color_ramp.elements[1].color = (0.016, 0.038, 0.078, 1.0)
    nt.links.new(mr.outputs['Result'], ramp.inputs['Fac'])

    lp = nt.nodes.new('ShaderNodeLightPath')
    bg_cam = nt.nodes.new('ShaderNodeBackground')
    bg_cam.inputs['Strength'].default_value = 0.85
    nt.links.new(ramp.outputs['Color'], bg_cam.inputs['Color'])

    bg_refl = nt.nodes.new('ShaderNodeBackground')
    bg_refl.inputs['Color'].default_value = (0.58, 0.84, 1.0, 1.0)
    bg_refl.inputs['Strength'].default_value = 2.0

    z_strip = nt.nodes.new('ShaderNodeMapRange')
    z_strip.inputs['From Min'].default_value = 0.56
    z_strip.inputs['From Max'].default_value = 0.86
    z_strip.clamp = True
    nt.links.new(sep.outputs['Z'], z_strip.inputs['Value'])

    mix_r = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(z_strip.outputs['Result'], mix_r.inputs['Fac'])
    nt.links.new(bg_cam.outputs['Background'], mix_r.inputs[1])
    nt.links.new(bg_refl.outputs['Background'], mix_r.inputs[2])

    mix_p = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Glossy Ray'], mix_p.inputs['Fac'])
    nt.links.new(bg_cam.outputs['Background'], mix_p.inputs[1])
    nt.links.new(mix_r.outputs['Shader'], mix_p.inputs[2])
    nt.links.new(mix_p.outputs['Shader'], out_w.inputs['Surface'])

    # Materials
    def make_obsidian_pbt():
        m = bpy.data.materials.new("Mat_ObsidianPBT")
        n = m.node_tree
        n.nodes.clear()
        o = n.nodes.new('ShaderNodeOutputMaterial')
        b = n.nodes.new('ShaderNodeBsdfPrincipled')
        b.inputs['Base Color'].default_value = (0.020, 0.028, 0.044, 1.0)
        b.inputs['Metallic'].default_value = 0.32
        b.inputs['Roughness'].default_value = 0.25
        b.inputs['Coat Weight'].default_value = 0.40
        b.inputs['Coat Roughness'].default_value = 0.09
        n.links.new(b.outputs['BSDF'], o.inputs['Surface'])
        return m

    def make_anodized_chassis():
        m = bpy.data.materials.new("Mat_AnodizedChassis")
        n = m.node_tree
        n.nodes.clear()
        o = n.nodes.new('ShaderNodeOutputMaterial')
        b = n.nodes.new('ShaderNodeBsdfPrincipled')
        b.inputs['Base Color'].default_value = (0.045, 0.062, 0.092, 1.0)
        b.inputs['Metallic'].default_value = 0.88
        b.inputs['Roughness'].default_value = 0.20
        n.links.new(b.outputs['BSDF'], o.inputs['Surface'])
        return m

    def make_mirror_deck():
        m = bpy.data.materials.new("Mat_MirrorDeck")
        n = m.node_tree
        n.nodes.clear()
        o = n.nodes.new('ShaderNodeOutputMaterial')
        b = n.nodes.new('ShaderNodeBsdfPrincipled')
        b.inputs['Base Color'].default_value = (0.008, 0.013, 0.024, 1.0)
        b.inputs['Metallic'].default_value = 0.68
        b.inputs['Roughness'].default_value = 0.032
        b.inputs['Coat Weight'].default_value = 1.0
        b.inputs['Coat Roughness'].default_value = 0.015
        n.links.new(b.outputs['BSDF'], o.inputs['Surface'])
        return m

    def make_frosted_sapphire():
        m = bpy.data.materials.new("Mat_FrostedSapphire")
        m.use_raytrace_refraction = True
        n = m.node_tree
        n.nodes.clear()
        o = n.nodes.new('ShaderNodeOutputMaterial')
        b = n.nodes.new('ShaderNodeBsdfPrincipled')
        b.inputs['Base Color'].default_value = (0.18, 0.56, 0.88, 1.0)
        b.inputs['Metallic'].default_value = 0.04
        b.inputs['Roughness'].default_value = 0.16
        b.inputs['IOR'].default_value = 1.54
        b.inputs['Transmission Weight'].default_value = 0.78
        b.inputs['Subsurface Weight'].default_value = 0.28
        b.inputs['Subsurface Scale'].default_value = 0.10
        b.inputs['Coat Weight'].default_value = 1.0
        b.inputs['Coat Roughness'].default_value = 0.025
        b.inputs['Emission Color'].default_value = (0.06, 0.45, 0.92, 1.0)
        b.inputs['Emission Strength'].default_value = 0.22
        n.links.new(b.outputs['BSDF'], o.inputs['Surface'])
        return m, b

    def make_glow(name, col, strength):
        m = bpy.data.materials.new(name)
        n = m.node_tree
        n.nodes.clear()
        o = n.nodes.new('ShaderNodeOutputMaterial')
        b = n.nodes.new('ShaderNodeBsdfPrincipled')
        b.inputs['Base Color'].default_value = (*col, 1.0)
        b.inputs['Emission Color'].default_value = (*col, 1.0)
        b.inputs['Emission Strength'].default_value = strength
        b.inputs['Roughness'].default_value = 0.12
        n.links.new(b.outputs['BSDF'], o.inputs['Surface'])
        return m, b

    m_pbt = make_obsidian_pbt()
    m_chassis = make_anodized_chassis()
    m_deck = make_mirror_deck()
    m_hero, bsdf_hero = make_frosted_sapphire()
    m_cyan, bsdf_cyan = make_glow("Mat_IceCyan", (0.18, 0.74, 1.0), 4.5)
    m_bone, bsdf_bone = make_glow("Mat_BoneLegend", (0.94, 0.98, 1.0), 6.5)
    m_dim_leg, _ = make_glow("Mat_DimLegend", (0.28, 0.46, 0.68), 0.85)
    m_sub_rim, _ = make_glow("Mat_SubRim", (0.10, 0.48, 0.85), 1.6)

    vfont = bpy.data.fonts.load(JP_FONT_PATH) if os.path.exists(JP_FONT_PATH) else None

    # 1. Expansive Dark Mirror-Water Deck (`z = 0.0`)
    bpy.ops.mesh.primitive_plane_add(size=70.0, location=(0.0, 0.0, 0.0))
    deck = bpy.context.active_object
    deck.data.materials.append(m_deck)

    for gi, gr in enumerate([1.65, 3.25, 5.05, 7.10, 9.40]):
        g_ring = create_ring_mesh(f"EtchRing_{gi}", gr + 0.015, gr, 0.006, segs=112, mat=m_sub_rim)
        g_ring.location = (0.0, 0.0, 0.004)

    # 2. Compact 5x3 Precision Keyboard Cluster + Anodized Bezel Frame on Mirror Water
    pitch = 2.08
    # Sleek low-profile anodized frame around 5x3 cluster (`w=11.0, d=6.8`)
    for bx, by, sx, sy in [
        (0.0,  3.42, 11.1, 0.24),
        (0.0, -3.42, 11.1, 0.24),
        (-5.43, 0.0, 0.24, 7.08),
        ( 5.43, 0.0, 0.24, 7.08),
    ]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(bx, by, 0.16))
        b_bar = bpy.context.active_object
        b_bar.scale = (sx, sy, 0.32)
        add_bevel(b_bar, width=0.04, segments=2)
        b_bar.data.materials.append(m_chassis)

    sub_labels = {
        (-2, 1): "ESC", (-1, 1): "あ", (0, 1): "か", (1, 1): "さ", (2, 1): "DEL",
        (-2, 0): "TAB", (-1, 0): "な",               (1, 0): "は", (2, 0): "⏎",
        (-2, -1): "CTRL", (-1, -1): "ま", (0, -1): "や", (1, -1): "ら", (2, -1): "SHIFT",
    }
    neighbor_caps = []
    for gy in range(-1, 2):
        for gx in range(-2, 3):
            if gx == 0 and gy == 0:
                continue
            kx, ky = gx * pitch, gy * pitch
            collar = create_ring_mesh(f"Collar_{gx}_{gy}", 0.94, 0.85, 0.035, segs=32, mat=m_sub_rim)
            collar.location = (kx, ky, 0.02)
            cap = make_sculpted_keycap(f"Cap_{gx}_{gy}", w_bot=1.80, w_top=1.36, h=0.72, scoop=0.075, mat=m_pbt)
            cap.location = (kx, ky, 0.12)
            lbl_str = sub_labels.get((gx, gy), "")
            if lbl_str:
                t_sub = make_3d_text(f"SubLbl_{gx}_{gy}", lbl_str, 0.24 if len(lbl_str) > 1 else 0.34, 0.008, m_dim_leg, vfont)
                t_sub.parent = cap
                t_sub.location = (0.0, 0.0, 0.665)
            neighbor_caps.append((cap, gx, gy, math.hypot(kx, ky)))

    # 3. Hero Center Frosted-Sapphire Keycap with Glowing 3D `ねえ` Legend + Homing Bar!
    hero_well = create_ring_mesh("HeroWell", 1.08, 0.90, 0.06, segs=64, mat=m_cyan)
    hero_well.location = (0.0, 0.0, 0.03)

    hero_cap = make_sculpted_keycap("HeroCrystalCap", w_bot=1.86, w_top=1.42, h=0.84, scoop=0.085, mat=m_hero)
    hero_cap.location = (0.0, 0.0, 0.24)

    nee_txt = make_3d_text("HeroNeeLegend", "ねえ", 0.46, 0.005, m_bone, vfont)
    nee_txt.parent = hero_cap
    nee_txt.location = (0.0, 0.08, 0.766)

    bpy.ops.mesh.primitive_cube_add(size=1.0)
    homing_bar = bpy.context.active_object
    homing_bar.scale = (0.44, 0.042, 0.012)
    add_bevel(homing_bar, width=0.008, segments=2)
    homing_bar.data.materials.append(m_bone)
    homing_bar.parent = hero_cap
    homing_bar.location = (0.0, -0.44, 0.782)

    # 4. Razor-Thin Concentric Actuation Photonic Ripple Rings (Delicate sapphire laser caustics!)
    shock_rings = []
    shock_mats = []
    for si in range(4):
        col_s = (0.68, 0.92, 1.0) if si == 0 else (0.16, 0.72, 1.0)
        sm, sb = make_glow(f"Mat_Shock_{si}", col_s, 4.2)
        sr = create_ring_mesh(f"ShockRing_{si}", 1.007, 0.995, 0.008, segs=128, mat=sm)
        sr.location = (0.0, 0.0, 0.84 if si == 0 else 0.03)
        shock_rings.append(sr)
        shock_mats.append(sb)

    # 5. Studio Lighting (Crisp bevel highlights without clipping)
    def make_area(name, loc, rot_deg, energy, col, sx, sy):
        ld = bpy.data.lights.new(name, type='AREA')
        ld.shape = 'RECTANGLE'
        ld.size = sx
        ld.size_y = sy
        ld.energy = energy
        ld.color = col
        lo = bpy.data.objects.new(name, ld)
        lo.location = loc
        lo.rotation_euler = tuple(math.radians(a) for a in rot_deg)
        bpy.context.collection.objects.link(lo)
        return lo

    make_area("KeySoftbox", (-4.8, -4.2, 6.8), (36, -28, -35), 185.0, (0.86, 0.95, 1.0), 6.0, 3.5)
    make_area("CyanRimBack", (4.2, 5.8, 4.0), (-48, 22, 145), 260.0, (0.18, 0.74, 1.0), 7.5, 2.5)
    make_area("FillRight", (5.8, -3.5, 4.4), (42, 38, 40), 95.0, (0.68, 0.84, 1.0), 4.5, 3.2)

    pt_d = bpy.data.lights.new("ActuationCorePt", type='POINT')
    pt_d.energy = 28.0
    pt_d.color = (0.16, 0.76, 1.0)
    pt_d.shadow_soft_size = 0.55
    pt_obj = bpy.data.objects.new("ActuationCorePt", pt_d)
    pt_obj.location = (0.0, 0.0, 0.30)
    bpy.context.collection.objects.link(pt_obj)

    # 6. Cinema Macro Camera (`46mm f/2.4`) — spacious framing with generous negative space on right!
    cd = bpy.data.cameras.new("GlassKeyCam")
    cd.lens = 46.0
    cd.clip_start = 0.1
    cd.clip_end = 200.0
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = 2.4
    cam = bpy.data.objects.new("GlassKeyCam", cd)
    bpy.context.collection.objects.link(cam)
    sc.camera = cam

    def update(t):
        if t < 0.58:
            press = 0.06 * smoothstep(t / 0.58)
        elif t < 1.24:
            u_str = clamp((t - 0.58) / 0.14)
            press = lerp(0.06, 1.0, ease_out_expo(u_str))
        else:
            u_rel = clamp((t - 1.24) / 0.52)
            press = lerp(1.0, 0.16, ease_out_expo(u_rel))

        hero_z = lerp(0.28, 0.025, press)
        hero_cap.location = (0.0, 0.0, hero_z)

        flash = math.exp(-max(0.0, t - 0.64) * 4.2) if t >= 0.60 else 0.10 * smoothstep(t / 0.58)
        bsdf_hero.inputs['Emission Strength'].default_value = 0.22 + flash * 0.95
        bsdf_bone.inputs['Emission Strength'].default_value = 5.5 + flash * 8.5
        bsdf_cyan.inputs['Emission Strength'].default_value = 3.2 + flash * 7.5
        pt_obj.data.energy = 24.0 + flash * 210.0

        for cap_o, gx, gy, dist in neighbor_caps:
            wave_t = t - 0.64 - dist * 0.060
            sym_dip = 0.0
            if wave_t > 0.0:
                sym_dip = math.exp(-wave_t * 4.2) * math.sin(min(math.pi, wave_t * 14.0)) * 0.11
            cap_o.location = (gx * pitch, gy * pitch, 0.12 - max(0.0, sym_dip))

        for si, sr in enumerate(shock_rings):
            st_i = t - (0.62 + si * 0.14)
            if st_i <= 0.0:
                sr.scale = (0.005, 0.005, 1.0)
                shock_mats[si].inputs['Emission Strength'].default_value = 0.0
            else:
                su = clamp(st_i / 1.30)
                rad_s = lerp(0.95, 7.6, ease_out_expo(su))
                sr.scale = (rad_s, rad_s, 1.0)
                shock_mats[si].inputs['Emission Strength'].default_value = (1.0 - su * 0.82) * 4.8

        u_all = clamp(t / DUR)
        end_center = smoothstep(clamp((t - 1.36) / 0.70))

        ang = lerp(-1.24, -0.58, ease_in_out_cubic(u_all))
        horiz_d = lerp(7.85, 5.95, smoothstep(clamp(t / 1.15))) * lerp(1.0, 0.36, end_center)
        cam_z = lerp(4.85, 3.65, smoothstep(clamp(t / 1.10))) + lerp(0.0, 3.65, end_center)

        cam_pos = Vector((math.cos(ang) * horiz_d, math.sin(ang) * horiz_d, cam_z))
        right_vec = Vector((-math.sin(ang), math.cos(ang), 0.0))
        tgt_offset = right_vec * lerp(1.75, 0.0, end_center)
        tgt = Vector((0.0, 0.0, lerp(0.28, 0.10, end_center))) + tgt_offset

        cam.location = cam_pos
        direction = (tgt - cam_pos).normalized()
        quat = direction.to_track_quat('-Z', 'Y')
        roll_m = Matrix.Rotation(math.radians(lerp(-5.0, 0.0, ease_in_out_cubic(u_all))), 3, 'Z')
        cam.rotation_euler = (quat.to_matrix() @ roll_m).to_euler()
        cam.data.lens = lerp(46.0, 42.0, end_center)
        cam.data.dof.focus_distance = max(0.8, (Vector((0.0, 0.0, hero_z + 0.55)) - cam_pos).length)

    return sc, update


def main():
    argv = sys.argv
    args = argv[argv.index("--") + 1:] if "--" in argv else []
    mode = args[0] if args else "lookdev"

    if mode == "lookdev":
        sc, upd = build_scene(width=960, height=540, samples=16)
        ld_dir = os.path.join(OUT_DIR, "_lookdev")
        os.makedirs(ld_dir, exist_ok=True)
        times = [0.15, 0.52, 0.68, 0.95, 1.40, 1.95]
        for idx, ts in enumerate(times):
            upd(ts)
            p = os.path.join(ld_dir, f"ld_{idx}_{ts:.2f}s.jpg")
            sc.render.filepath = p
            bpy.ops.render.render(write_still=True)
            print(f"[LookDev] rendered {p}", flush=True)
    else:
        os.makedirs(OUT_DIR, exist_ok=True)
        sc, upd = build_scene(width=1920, height=1080, samples=18)
        total_f = int(math.ceil(DUR * FPS))  # 125 frames
        t0 = time.time()
        for fi in range(total_f):
            upd(fi / float(FPS))
            sc.render.filepath = os.path.join(OUT_DIR, f"f{fi:04d}.jpg")
            bpy.ops.render.render(write_still=True)
            if fi == 0 or (fi + 1) % 25 == 0 or fi == total_f - 1:
                el = time.time() - t0
                print(f"[B3D_08_glasskey] {fi+1}/{total_f} ({(fi+1)/max(0.01, el):.1f} fps)", flush=True)


if __name__ == "__main__":
    main()
