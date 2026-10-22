#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate Hikakin-style voice MP3 files for Kaiju Quest.
1st priority: TikTok TTS endpoint (voice: jp_006 - CapCut/TikTok Hikakin voice)
2nd priority fallback: edge-tts (ja-JP-KeitaNeural, rate=+20%, pitch=+20Hz)
Outputs to: public/sounds/<voice_id>.mp3
"""

import asyncio
import base64
import json
import os
import sys
import time
from typing import Dict, Optional
import requests

# Voice lines catalogue across Kaiju Quest
VOICE_SCRIPTS: Dict[str, str] = {
    # --- 1. タブナビゲーション ---
    "tab_quest": "ブンブンハローかいじゅうクエスト！どうもヒカキンです！できたものをタップしてね！レッツゴー！",
    "tab_summon_ready_kaiju": "ブンブン！かいじゅうしょうかんタイム！すきなわざとタイプをえらんでね！いくぞー！",
    "tab_summon_ready_insect": "ブンブン！こんちゅう つかまえるタイム！クヌギの木にしゅうごうだ！いくぞー！",
    "tab_summon_wait_kaiju": "あとエネルギーをためると しょうかんできるよ！いっしょにがんばろう！",
    "tab_summon_wait_insect": "あとエネルギーをためると こんちゅうを つかまえられるよ！いっしょにがんばろう！",
    "tab_zukan": "かいじゅうずかん！いっぱいあつまったよ！やばいね！神ってるー！",
    "tab_battle": "ふたりで かいじゅうバトル！じょうくんと パパで たいけつだ！レッツゴー！",
    "voice_toggle_on": "ブンブンハロー！こえがでるようになったよ！",
    "mode_kaiju": "かいじゅうしょうかんモード！",
    "mode_insect": "こんちゅう つかまえるモード！クヌギの木にしゅうごうだ！",

    # --- 2. お支度クエスト（全15クエスト クリア時＆済タップ時） ---
    # ① あさ おきる
    "quest_clear_wake_up": "やったー！あさ おきる クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_wake_up": "あさ おきるは もうバッチリクリアしてるよ！さすがだね！",
    # ② あさの ぎゅうにゅう
    "quest_clear_morning_milk": "やったー！あさの ぎゅうにゅう クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_morning_milk": "あさの ぎゅうにゅうは もうバッチリクリアしてるよ！さすがだね！",
    # ③ あさごはん
    "quest_clear_breakfast": "やったー！あさごはん クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_breakfast": "あさごはんは もうバッチリクリアしてるよ！さすがだね！",
    # ④ あさはみがき
    "quest_clear_morning_teeth": "やったー！あさはみがき クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_morning_teeth": "あさはみがきは もうバッチリクリアしてるよ！さすがだね！",
    # ⑤ トイレ（朝）
    "quest_clear_toilet_morning": "やったー！トイレ クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_toilet_morning": "トイレは もうバッチリクリアしてるよ！さすがだね！",
    # ⑥ くつそろえ
    "quest_clear_shoes": "やったー！くつそろえ クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_shoes": "くつそろえは もうバッチリクリアしてるよ！さすがだね！",
    # ⑦ ほいくえんに いく
    "quest_clear_nursery_go": "やったー！ほいくえんに いく クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_nursery_go": "ほいくえんに いくは もうバッチリクリアしてるよ！さすがだね！",
    # ⑧ ほいくえんから かえる
    "quest_clear_nursery_back": "やったー！ほいくえんから かえる クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_nursery_back": "ほいくえんから かえるは もうバッチリクリアしてるよ！さすがだね！",
    # ⑨ おもちゃの おかたづけ
    "quest_clear_tidy_toys": "やったー！おもちゃの おかたづけ クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_tidy_toys": "おもちゃの おかたづけは もうバッチリクリアしてるよ！さすがだね！",
    # ⑩ よるごはん
    "quest_clear_dinner": "やったー！よるごはん クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_dinner": "よるごはんは もうバッチリクリアしてるよ！さすがだね！",
    # ⑪ おふろ
    "quest_clear_bath": "やったー！おふろ クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_bath": "おふろは もうバッチリクリアしてるよ！さすがだね！",
    # ⑫ よるはみがき
    "quest_clear_night_teeth": "やったー！よるはみがき クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_night_teeth": "よるはみがきは もうバッチリクリアしてるよ！さすがだね！",
    # ⑬ お着替え
    "quest_clear_clothes": "やったー！お着替え クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_clothes": "お着替えは もうバッチリクリアしてるよ！さすがだね！",
    # ⑭ ねるまえの トイレ
    "quest_clear_night_toilet": "やったー！ねるまえの トイレ クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_night_toilet": "ねるまえの トイレは もうバッチリクリアしてるよ！さすがだね！",
    # ⑮ おやすみ
    "quest_clear_sleep": "やったー！おやすみ クリア！エネルギーと けいけんち玉を ゲットしたよ！",
    "quest_done_sleep": "おやすみは もうバッチリクリアしてるよ！さすがだね！",

    # クエスト特別トリガー
    "daily_reset": "ブンブン！あたらしい1にちのスタート！きょうもクエストがんばろう！レッツゴー！",
    "test_charge": "キターーー！おためしチャージ！エネルギー 3こと、けいけんち玉 3こを ゲットしたよ！やばすぎるー！",
    "quest_energy_full": "キターーー！エネルギーがまんたんになったよ！けいけんち玉も ゲット！",
    "quest_partner_levelup": "キターーー！あいぼうが レベルアップしたよ！やばすぎるー！",

    # --- 3. 属性・フィールド・タイプ選択 ---
    "el_fire": "ほのおタイプ！メラメラあついぞ！これマジでやばいねー！",
    "el_water": "みずタイプ！ザブーンと超ビッグウェーブ！つよすぎるー！",
    "el_thunder": "かみなりタイプ！ビリビリしびれるー！神ってるね！",
    "el_nature": "しぜんタイプ！もりもりパワー全開！レッツゴー！",
    "field_volcano": "かざんフィールド！",
    "field_water": "みずべフィールド！",
    "field_thunder": "じゅうでんフィールド！",
    "field_forest": "もりフィールド！",
    "tp_dino": "きょうりゅう！ドッスン！超でっかくてかっこいいー！",
    "tp_dragon": "ドラゴン！ブンブンお空をとぶぞ！やばいねー！",
    "tp_robot": "ロボット！ガシーン！超ハイテクで神ってるー！",
    "tp_beast": "ビースト！ガルルル！スピードマックス！レッツゴー！",
    "tp_kabuto": "カブトムシの なかま！おおきな ツノで つきあげるぞ！",
    "tp_kuwagata": "クワガタの なかま！おおアゴで ガッチリ はさむぞ！",
    "tp_hunter": "ハンターこんちゅう！カマや ハリで ねらいうちだ！",
    "tp_flier": "おおぞらの こんちゅう！すごい スピードで とぶぞ！",

    # --- 4. 召喚・孵化演出 ---
    "summon_start_kaiju": "うおおおー！タマゴがひかってゆれてるぞ！なにがでるかな！？ドキドキするねー！",
    "summon_start_insect": "うおおおー！クヌギの木が ゆれてるぞ！なにがでてくるかな！？ドキドキするねー！",
    "summon_no_energy": "おっとー！エネルギーがたりないよ！クエストをクリアするか、おためしチャージをおしてね！",
    "summon_result_kaiju": "キターーー！あたらしい かいじゅうのとうじょうだ！これマジでやばいねー！",
    "summon_result_insect": "キターーー！ほんものの こんちゅうを つかまえたぞ！やばいねー！",
    "summon_result_powerup": "キターーー！パワーアップしょうかん！レベルがあがったぞ！つよすぎるー！",
    "summon_result_max": "キターーー！すでに レベルMAXだから、けいけんち玉を ゲットしたよ！やばすぎるー！",

    # --- 5. バトル画面 ---
    "battle_start": "ブンブン！バトルスタート！じょうたいパパ！じょうのターンだ！いくぞー！",
    "battle_no_mp": "おっと！MPが たりないよ！パワーためる ボタンで MPを かいふくしよう！",
    "battle_heal_no_mp": "おっと！かいふくには MPが 15 ひつようだよ！ためてみよう！",
    "battle_heal": "キターーー！かいふくしたぞ！HPが ふっかつだ！",
    "battle_charge": "パワーためる！MPが たまったぞ！つぎは かいしんの いちげき 確定だ！",
    "battle_critical": "かいしんの いちげきーっ！！",
    "battle_effective": "こうかは ばつぐんだ！",
    "battle_win_p1": "キターーー！じょうの だいしょうりーっ！おめでとう！ごほうびに けいけんち玉 2こと、けいけんちをゲットしたよ！神ってるー！",
    "battle_win_p2": "うおおお！パパの しょうり！でも さいごまで たたかった ごほうびに けいけんち玉 2こと、けいけんちをゲットしたよ！",

    # --- 6. 図鑑＆カード育成 ---
    "zukan_locked": "おっと！まだみつかっていない かいじゅうだよ！えらんで しょうかんしてみよう！レッツゴー！",
    "zukan_tap_kaiju": "キターーー！かっこいい なかまだね！けいけんち玉で レベルアップや しんかも できるよ！",
    "card_no_orbs": "おっとー！けいけんち玉が たりないよ！お支度クエストをクリアするか、バトルをして けいけんち玉を ゲットしよう！",
    "card_max_level": "この なかまは もう レベルMAXの 究極キングだよ！ほかの なかまを そだててね！",
    "card_give_orb": "けいけんち玉を あげたよ！あとちょっとで レベルアップだ！",
    "card_level_up": "テレレレッテッテッテー！レベルがあがったぞ！ちからが ぐんぐん あがった！",
    "card_evolution": "うおおおーっ！おや！？ようすが…！しんかしたーっ！神ってるー！",
    "card_max_evolution": "ついに、レベルMAXの 究極完全体になったぞーっ！やばすぎるーー！！",
    "card_partner": "やったー！あいぼうに したよ！いっしょに クエストを がんばろう！",
    "card_skill_locked": "このわざは レベルアップすると おぼえるよ！たのしみだね！",
    "card_skill_attack": "くらえっ！ひっさつわざだーっ！これマジでやばいねー！",
}

# TikTok availability flag
TIKTOK_AVAILABLE = True


def test_tiktok_tts() -> bool:
    """Check once if TikTok TTS endpoint is reachable."""
    try:
        resp = requests.post(
            "https://tiktok-tts.weilnet.workers.dev/api/generation",
            json={"text": "テスト", "voice": "jp_006"},
            headers={"Content-Type": "application/json"},
            timeout=1.5,
        )
        return resp.status_code == 200 and "data" in resp.json()
    except Exception:
        return False


def try_tiktok_tts(text: str) -> Optional[bytes]:
    """
    Attempt to generate voice using TikTok / CapCut TTS endpoint (voice: jp_006).
    Returns MP3 bytes if successful, None otherwise.
    """
    global TIKTOK_AVAILABLE
    if not TIKTOK_AVAILABLE:
        return None

    endpoints = [
        "https://tiktok-tts.weilnet.workers.dev/api/generation",
        "https://tiktok-voice-generator.com/api/generation",
    ]

    for ep in endpoints:
        try:
            resp = requests.post(
                ep,
                json={"text": text, "voice": "jp_006"},
                headers={"Content-Type": "application/json", "User-Agent": "KaijuQuestApp/1.0"},
                timeout=1.5,
            )
            if resp.status_code == 200:
                data = resp.json()
                if "data" in data and data["data"]:
                    return base64.b64decode(data["data"])
        except Exception:
            pass

    return None


async def generate_edge_tts(text: str, output_path: str) -> bool:
    """
    Fallback: Generate high-tension voice using edge-tts (ja-JP-KeitaNeural).
    """
    import edge_tts

    try:
        communicate = edge_tts.Communicate(
            text=text,
            voice="ja-JP-KeitaNeural",
            rate="+20%",
            pitch="+20Hz",
        )
        await communicate.save(output_path)
        return True
    except Exception as e:
        print(f"    [edge-tts Error]: {e}", file=sys.stderr, flush=True)
        return False


async def process_voice(voice_id: str, text: str, output_dir: str, force: bool = False):
    file_path = os.path.join(output_dir, f"{voice_id}.mp3")

    if not force and os.path.exists(file_path) and os.path.getsize(file_path) > 1000:
        print(f"  [Skipped - Already exists] {voice_id}.mp3 ({os.path.getsize(file_path)} bytes)", flush=True)
        return True

    # 1. Try TikTok endpoint first
    audio_bytes = try_tiktok_tts(text)
    if audio_bytes and len(audio_bytes) > 500:
        with open(file_path, "wb") as f:
            f.write(audio_bytes)
        print(f"  [TikTok jp_006] Generated {voice_id}.mp3 ({len(audio_bytes)} bytes)", flush=True)
        return True

    # 2. Fallback to edge-tts (ja-JP-KeitaNeural, +20%, +20Hz)
    success = await generate_edge_tts(text, file_path)
    if success and os.path.exists(file_path):
        size = os.path.getsize(file_path)
        print(f"  [edge-tts Keita] Generated {voice_id}.mp3 ({size} bytes)", flush=True)
        return True

    print(f"  [FAILED] Could not generate {voice_id}", file=sys.stderr, flush=True)
    return False


async def main():
    global TIKTOK_AVAILABLE
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, ".."))
    output_dir = os.path.join(project_root, "public", "sounds")

    force = "--force" in sys.argv

    os.makedirs(output_dir, exist_ok=True)
    print(f"=== Kaiju Quest Voice Generator ===", flush=True)
    print(f"Total voice lines to generate: {len(VOICE_SCRIPTS)}", flush=True)
    print(f"Output directory: {output_dir}", flush=True)

    # Check TikTok TTS availability once
    print("Checking TikTok TTS endpoint availability...", flush=True)
    TIKTOK_AVAILABLE = test_tiktok_tts()
    if TIKTOK_AVAILABLE:
        print("TikTok TTS endpoint is ONLINE! Using jp_006 voice.", flush=True)
    else:
        print("TikTok TTS endpoint is OFFLINE or unreachable. Falling back directly to edge-tts (ja-JP-KeitaNeural +20% / +20Hz).", flush=True)

    print("--------------------------------------------------", flush=True)

    success_count = 0
    manifest = {}

    for idx, (voice_id, text) in enumerate(VOICE_SCRIPTS.items(), 1):
        print(f"[{idx}/{len(VOICE_SCRIPTS)}] Generating '{voice_id}'...", flush=True)
        ok = await process_voice(voice_id, text, output_dir, force=force)
        if ok:
            success_count += 1
            manifest[voice_id] = {
                "id": voice_id,
                "text": text,
                "file": f"/sounds/{voice_id}.mp3",
            }
        await asyncio.sleep(0.02)

    manifest_path = os.path.join(output_dir, "voice_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print("--------------------------------------------------", flush=True)
    print(f"Done! Successfully generated {success_count}/{len(VOICE_SCRIPTS)} voices.", flush=True)
    print(f"Manifest saved to: {manifest_path}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
