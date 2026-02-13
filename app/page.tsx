'use client'

import { useState, useEffect, useRef } from 'react'

interface Activity {
  id: number
  title: string
  description: string
  emoji: string
  color: string
  sound: string
  category: string
}

export default function ValentineChooser() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showSecret, setShowSecret] = useState(false)
  const [secretInput, setSecretInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const [clickCount, setClickCount] = useState(0)
  const [easterEgg, setEasterEgg] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [shakeSecret, setShakeSecret] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  const unlockMusicRef = useRef<HTMLAudioElement | null>(null)

  // Initialize background music (but don't play yet)
  useEffect(() => {
    bgMusicRef.current = new Audio()
    bgMusicRef.current.src = '/sound/Taylor_Swift_Lover.mp3'
    bgMusicRef.current.loop = true
    bgMusicRef.current.volume = 0.3

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current = null
      }
    }
  }, [])

  const activities: Activity[] = [
    // 🍽️ อาหาร & เครื่องดื่ม (15)
    { id: 1, title: '🍽️ ดินเนอร์หรูในโรงแรม', description: 'จองโต๊ะสุดพิเศษ วิวสวย บรรยากาศโรแมนติก', emoji: '🕯️', color: 'from-rose-500 to-pink-500', sound: '🎵', category: 'food' },
    { id: 2, title: '☕ คาเฟ่ฮอปทั้งวัน', description: 'วางแผนเที่ยวร้านกาแฟ 3-5 ร้าน ลองเมนูใหม่ๆ', emoji: '🧋', color: 'from-amber-500 to-orange-500', sound: '☕', category: 'food' },
    { id: 3, title: '🍕 Food tour ในเมือง', description: 'กินอาหารท้องถิ่นหรือแนวใหม่ๆ ทัวร์ไปเรื่อยๆ', emoji: '🍜', color: 'from-orange-500 to-red-500', sound: '🥢', category: 'food' },
    { id: 4, title: '🍰 ทำเบเกอรี่ด้วยกัน', description: 'อบคุกกี้ ทำเค้ก ตกแต่งสวยๆ กินด้วยกันแบบอุ่นๆ', emoji: '👨‍🍳', color: 'from-pink-500 to-rose-500', sound: '🥐', category: 'food' },
    { id: 5, title: '🍷 Wine & Cheese Tasting', description: 'ไปร้านไวน์บาร์ ลองไวน์หลายแบบกับชีส', emoji: '🧀', color: 'from-purple-500 to-pink-500', sound: '🍇', category: 'food' },
    { id: 6, title: '🍱 ทำซูชิด้วยกัน', description: 'ซื้อของมาม้วนซูชิเอง สนุกและอร่อย', emoji: '🍣', color: 'from-green-500 to-teal-500', sound: '🥢', category: 'food' },
    { id: 7, title: '🥞 ทำอาหารเช้าพิเศษ', description: 'ตื่นเช้าทำ pancake, french toast พร้อมกาแฟหอมๆ', emoji: '🍳', color: 'from-yellow-500 to-orange-500', sound: '🧇', category: 'food' },
    { id: 8, title: '🍕 ทำพิซซ่าเอง', description: 'บดแป้ง ทำซอส ใส่ท็อปปิ้งตามชอบ', emoji: '🫓', color: 'from-red-500 to-yellow-500', sound: '🧀', category: 'food' },
    { id: 9, title: '🍹 Mixology ที่บ้าน', description: 'ทำค็อกเทลสูตรใหม่ๆ สนุกกับการผสม', emoji: '🍸', color: 'from-cyan-500 to-blue-500', sound: '🍋', category: 'food' },
    { id: 10, title: '🍫 ทำช็อกโกแลต', description: 'หลอมช็อกโกแลต ทำทรัฟเฟิล ของขวัญหวานๆ', emoji: '🍬', color: 'from-amber-700 to-orange-700', sound: '💝', category: 'food' },
    { id: 11, title: '🥘 ทำอาหารประเทศอื่น', description: 'ลองทำอาหารอิตาเลียน ฝรั่งเศส หรือญี่ปุ่น', emoji: '🍝', color: 'from-green-600 to-teal-600', sound: '👨‍🍳', category: 'food' },
    { id: 12, title: '🧃 ไปตลาดเช้าด้วยกัน', description: 'เดินตลาดเช้า ซื้อของสด ทำอาหารกลางวัน', emoji: '🥬', color: 'from-lime-500 to-green-500', sound: '🛒', category: 'food' },
    { id: 13, title: '🍦 Dessert Cafe Hopping', description: 'เที่ยวกินของหวาน ไอศกรีม เค้ก ทุกร้าน', emoji: '🧁', color: 'from-pink-400 to-rose-400', sound: '🍰', category: 'food' },
    { id: 14, title: '🌮 Street Food Adventure', description: 'กินอาหารริมทาง ลองของแปลกใหม่', emoji: '🥙', color: 'from-orange-600 to-red-600', sound: '🌶️', category: 'food' },
    { id: 15, title: '🍜 ทำราเมงสไตล์ญี่ปุ่น', description: 'ต้มน้ำซุป ทำไข่ต้ม ประกอบเป็นราเมงชาม', emoji: '🥣', color: 'from-amber-600 to-red-600', sound: '🍥', category: 'food' },

    // 🎬 บันเทิง & ผ่อนคลาย (15)
    { id: 16, title: '🎬 Movie Marathon ที่บ้าน', description: 'ดูหนังซีรีส์ที่ชอบตั้งแต่เช้ายันค่ำ', emoji: '🍿', color: 'from-purple-500 to-indigo-500', sound: '📺', category: 'entertainment' },
    { id: 17, title: '🎤 ไปร้องคาราโอเกะ', description: 'ปล่อยของ! ร้องเพลงดังๆ สนุกสุดเหวี่ยง', emoji: '🎼', color: 'from-pink-500 to-rose-500', sound: '🎶', category: 'entertainment' },
    { id: 18, title: '🎮 Gaming Night', description: 'เล่นเกมส์สนุกๆ แข่งกัน Co-op ด้วยกัน', emoji: '🕹️', color: 'from-violet-500 to-purple-500', sound: '🎯', category: 'entertainment' },
    { id: 19, title: '🎭 ดูละครหรือมิวสิคัล', description: 'จองตั๋วโรงละคร ดูการแสดงสด', emoji: '🎪', color: 'from-red-500 to-pink-500', sound: '🎨', category: 'entertainment' },
    { id: 20, title: '🎵 ไปคอนเสิร์ต', description: 'ดูคอนศิลปินที่ชอบ ร้องเพลงด้วยกัน', emoji: '🎸', color: 'from-orange-500 to-red-500', sound: '🎤', category: 'entertainment' },
    { id: 21, title: '🧘 โยคะคู่', description: 'ลองท่าโยคะแบบคู่ ผ่อนคลายและสนุก', emoji: '💆', color: 'from-teal-500 to-cyan-500', sound: '🌸', category: 'entertainment' },
    { id: 22, title: '🎲 Board Game Night', description: 'เล่นบอร์ดเกมหลายเกม กินขนม สนุกสุดคุ้ม', emoji: '🃏', color: 'from-green-500 to-emerald-500', sound: '🎯', category: 'entertainment' },
    { id: 23, title: '📚 อ่านหนังสือด้วยกัน', description: 'นอนอ่านหนังสือ อาจจะอ่านให้กันฟังก็ได้', emoji: '📖', color: 'from-amber-500 to-yellow-500', sound: '☕', category: 'entertainment' },
    { id: 24, title: '🎨 วาดรูปกัน', description: 'วาดภาพคู่ หรือวาดให้กัน ไม่ต้องเก่งก็ได้', emoji: '🖼️', color: 'from-blue-500 to-purple-500', sound: '🖌️', category: 'entertainment' },
    { id: 25, title: '🧩 ต่อจิ๊กซอว์ใหญ่ๆ', description: 'ซื้อจิ๊กซอว์ 1000+ ชิ้นมาต่อด้วยกัน', emoji: '🧩', color: 'from-indigo-500 to-blue-500', sound: '🎯', category: 'entertainment' },
    { id: 26, title: '🎬 ไปดูหนังโรง', description: 'ดูหนังใหม่ที่โรง ป็อปคอร์นเยอะๆ', emoji: '🎞️', color: 'from-gray-700 to-gray-900', sound: '🍿', category: 'entertainment' },
    { id: 27, title: '🎪 ไปงานเทศกาล', description: 'เช็คงานอีเวนต์ มาร์เก็ต เทศกาลต่างๆ', emoji: '🎉', color: 'from-green-500 to-emerald-500', sound: '🎊', category: 'entertainment' },
    { id: 28, title: '📻 Podcast Marathon', description: 'ฟัง podcast ที่ชอบ นอนหรือทำกิจกรรมอื่นไปด้วย', emoji: '🎧', color: 'from-purple-600 to-pink-600', sound: '🎙️', category: 'entertainment' },
    { id: 29, title: '🧘‍♀️ ไปสปา/นวด', description: 'พาไปผ่อนคลาย นวด สปา อ่างน้ำอุ่น', emoji: '💆‍♀️', color: 'from-teal-500 to-cyan-500', sound: '🌸', category: 'entertainment' },
    { id: 30, title: '🎪 ไปสวนสนุก', description: 'นั่งรถไฟเหาะ เล่นเครื่องเล่น สนุกกันทั้งวัน', emoji: '🎢', color: 'from-yellow-500 to-red-500', sound: '🎡', category: 'entertainment' },

    // 🏃 กีฬา & กิจกรรมกลางแจ้ง (20)
    { id: 31, title: '🏞️ เดินป่า/ปีนเขา', description: 'ไปเดินเส้นทางธรรมชาติ ชมวิวสวย ออกกำลังกาย', emoji: '⛰️', color: 'from-green-600 to-emerald-600', sound: '🌲', category: 'outdoor' },
    { id: 32, title: '🏖️ ไปเที่ยวทะเล', description: 'ขับรถชิลริมทะเล เดินชายหาด ว่ายน้ำ', emoji: '🌊', color: 'from-cyan-500 to-blue-500', sound: '🌴', category: 'outdoor' },
    { id: 33, title: '🚴 ปั่นจักรยาน', description: 'ปั่นไปตามเส้นทางสวยๆ แวะกินข้าวตามทาง', emoji: '🚲', color: 'from-lime-500 to-green-500', sound: '🌳', category: 'outdoor' },
    { id: 34, title: '⛺ ไปแคมป์ปิ้ง', description: 'ตั้งแคมป์ ทำอาหาร นอนดูดาว แบบชิลๆ', emoji: '🏕️', color: 'from-orange-600 to-amber-600', sound: '🔥', category: 'outdoor' },
    { id: 35, title: '🎣 ไปตกปลา', description: 'หาสระตกปลา นั่งชิล พูดคุย รอปลากิน', emoji: '🐟', color: 'from-blue-600 to-cyan-600', sound: '🎣', category: 'outdoor' },
    { id: 36, title: '🧗 ไต่หน้าผา', description: 'ลองไต่หน้าผาในร้อม หรือกลางแจ้ง ท้าทาย!', emoji: '🧗‍♀️', color: 'from-gray-600 to-stone-600', sound: '💪', category: 'outdoor' },
    { id: 37, title: '🏃 วิ่งออกกำลังกาย', description: 'วิ่งเช้าหรือเย็นที่สวนสาธารณะ ต่อด้วยอาหารเช้า', emoji: '👟', color: 'from-green-500 to-lime-500', sound: '💨', category: 'outdoor' },
    { id: 38, title: '🏊 ไปสระว่ายน้ำ', description: 'ว่ายน้ำ เล่นน้ำ นอนอาบแดด ผ่อนคลาย', emoji: '🏊‍♂️', color: 'from-blue-400 to-cyan-400', sound: '💦', category: 'outdoor' },
    { id: 39, title: '🌅 ดูพระอาทิตย์ขึ้น', description: 'ตื่นเช้ามาก ขับไปจุดชมวิว ดูพระอาทิตย์ขึ้น', emoji: '🌄', color: 'from-orange-400 to-pink-400', sound: '☀️', category: 'outdoor' },
    { id: 40, title: '🌇 ดูพระอาทิตย์ตก', description: 'หาจุดชมวิวสวย ดูพระอาทิตย์ตกแบบโรแมนติก', emoji: '🌆', color: 'from-orange-500 to-red-500', sound: '🌅', category: 'outdoor' },
    { id: 41, title: '🚗 Road Trip', description: 'ขับรถไปไหนมั่วๆ หาของกินอร่อย แล่นไปตามสบาย', emoji: '🗺️', color: 'from-blue-500 to-indigo-500', sound: '🚙', category: 'outdoor' },
    { id: 42, title: '🦌 ไปสวนสัตว์', description: 'ดูสัตว์น่ารัก ถ่ายรูป เดินเล่นทั้งวัน', emoji: '🐘', color: 'from-green-500 to-teal-500', sound: '🦁', category: 'outdoor' },
    { id: 43, title: '🌳 ปิกนิกในสวน', description: 'เตรียมอาหารไป ปูเสื่อนั่งกินในสวน', emoji: '🧺', color: 'from-lime-400 to-green-400', sound: '🌸', category: 'outdoor' },
    { id: 44, title: '🎿 เล่นสกี/สโนว์บอร์ด', description: 'ถ้าอากาศเหมาะ ไปเล่นหิมะ (หรือในร้อม)', emoji: '⛷️', color: 'from-cyan-300 to-blue-300', sound: '❄️', category: 'outdoor' },
    { id: 45, title: '🏌️ เล่นกอล์ฟ', description: 'ไปตีกอล์ฟที่สนามฝึก หรือสนามจริง', emoji: '⛳', color: 'from-green-400 to-emerald-400', sound: '🏌️', category: 'outdoor' },
    { id: 46, title: '🛶 พายเรือคายัค', description: 'พายเรือในทะเลสาบหรือแม่น้ำ ออกกำลังและสนุก', emoji: '🚣', color: 'from-blue-500 to-cyan-500', sound: '🌊', category: 'outdoor' },
    { id: 47, title: '🪂 กระโดดร่ม', description: 'ถ้าชอบความท้าทาย ลองกระโดดร่มสุดมันส์', emoji: '🎈', color: 'from-blue-600 to-sky-600', sound: '☁️', category: 'outdoor' },
    { id: 48, title: '🌸 ดูดอกไม้บาน', description: 'หาสถานที่มีดอกไม้สวย ถ่ายรูป ชมความงาม', emoji: '🌺', color: 'from-pink-400 to-rose-400', sound: '🌼', category: 'outdoor' },
    { id: 49, title: '⭐ ดูดาวกลางคืน', description: 'ไปที่มืด ห่างเมือง นอนดูดาวด้วยกัน', emoji: '🔭', color: 'from-indigo-900 to-purple-900', sound: '🌙', category: 'outdoor' },
    { id: 50, title: '🏇 ขี่ม้า', description: 'ไปฟาร์มขี่ม้า เดินเล่นในธรรมชาติ', emoji: '🐴', color: 'from-amber-700 to-orange-700', sound: '🌾', category: 'outdoor' },

    // 🎨 Creative & DIY (15)
    { id: 51, title: '🎨 Workshop ศิลปะ', description: 'เข้าคอร์สวาดรูป ปั้นดิน หรือทำงานศิลป์', emoji: '🖌️', color: 'from-purple-500 to-pink-500', sound: '🎭', category: 'creative' },
    { id: 52, title: '🧵 เรียนทำของ DIY', description: 'ทำกำไลข้อมือ พวงกุญแจ หรือของตกแต่ง', emoji: '🪡', color: 'from-rose-400 to-pink-400', sound: '✂️', category: 'creative' },
    { id: 53, title: '📷 Photo Shoot', description: 'ถ่ายรูปกันแบบเป็นทางการ หรือเล่นๆ สนุก', emoji: '📸', color: 'from-gray-600 to-slate-600', sound: '💡', category: 'creative' },
    { id: 54, title: '🎭 ทำ Vlog หรือ Video', description: 'ถ่าย vlog วันวาเลนไทน์ ตัดต่อ upload', emoji: '🎥', color: 'from-red-600 to-orange-600', sound: '🎬', category: 'creative' },
    { id: 55, title: '📝 เขียนจดหมายรัก', description: 'เขียนจดหมายยาวๆ บอกความรู้สึกที่มีต่อกัน', emoji: '💌', color: 'from-pink-500 to-rose-500', sound: '✉️', category: 'creative' },
    { id: 56, title: '🎼 แต่งเพลงด้วยกัน', description: 'ลองแต่งเพลง เขียนเนื้อร้อง อาจจะตลกก็ได้', emoji: '🎹', color: 'from-purple-600 to-indigo-600', sound: '🎵', category: 'creative' },
    { id: 57, title: '📖 เขียนนิยายสั้น', description: 'เขียนเรื่องสั้นเกี่ยวกับเรื่องราวของเรา', emoji: '🖊️', color: 'from-amber-600 to-orange-600', sound: '📚', category: 'creative' },
    { id: 58, title: '🏺 Workshop เซรามิก', description: 'ปั้นดิน เผา ทาสี ทำถ้วยหรือของตกแต่ง', emoji: '🫖', color: 'from-stone-500 to-amber-500', sound: '🎨', category: 'creative' },
    { id: 59, title: '🎀 ทำช่อดอกไม้', description: 'ไปซื้อดอกไม้สด มาจัดเป็นช่อด้วยกัน', emoji: '💐', color: 'from-pink-400 to-rose-400', sound: '🌹', category: 'creative' },
    { id: 60, title: '🎨 Paint & Sip', description: 'ไปคลาสวาดรูป ดื่มไวน์ สนุกผ่อนคลาย', emoji: '🍷', color: 'from-purple-500 to-rose-500', sound: '🖼️', category: 'creative' },
    { id: 61, title: '🧶 ถักไหมพรม', description: 'เรียนถักผ้าพันคอ หมวก หรือตุ๊กตาให้กัน', emoji: '🧣', color: 'from-red-400 to-pink-400', sound: '🎀', category: 'creative' },
    { id: 62, title: '🎪 ทำ Scrapbook', description: 'รวบรวมรูป ตั๋ว ความทรงจำ ทำเป็นสมุด', emoji: '📔', color: 'from-yellow-500 to-orange-500', sound: '✂️', category: 'creative' },
    { id: 63, title: '🎨 วาดรูปบนเสื้อ', description: 'ซื้อเสื้อสีพื้น มาวาดรูปใส่กัน', emoji: '👕', color: 'from-blue-400 to-cyan-400', sound: '🖍️', category: 'creative' },
    { id: 64, title: '🕯️ ทำเทียน', description: 'หลอมแว็กซ์ ใส่กลิ่น ทำเทียนสวยๆ', emoji: '🪔', color: 'from-amber-400 to-orange-400', sound: '🔥', category: 'creative' },
    { id: 65, title: '🎨 Tie-dye เสื้อผ้า', description: 'ย้อมสีผ้า ทำลายเก๋ๆ สนุกและได้ของใช้', emoji: '🌈', color: 'from-pink-500 via-purple-500 to-blue-500', sound: '🎨', category: 'creative' },

    // 🏠 At Home & Cozy (15)
    { id: 66, title: '🏡 Stay Home Day', description: 'ไม่ต้องไปไหน แค่อยู่ด้วยกันก็พอ', emoji: '💕', color: 'from-red-500 to-rose-500', sound: '🏠', category: 'home' },
    { id: 67, title: '🛁 Spa Day ที่บ้าน', description: 'ทำ face mask นวด อาบน้ำอุ่น ผ่อนคลาย', emoji: '🧖', color: 'from-teal-400 to-cyan-400', sound: '🕊️', category: 'home' },
    { id: 68, title: '🍿 Netflix & Chill', description: 'ดูซีรีส์ที่ชอบ ทั้งวันไม่หยุด', emoji: '📺', color: 'from-red-600 to-gray-800', sound: '🍿', category: 'home' },
    { id: 69, title: '🎮 เล่นเกมส์คอนโซล', description: 'เล่น PS, Xbox, Switch แข่งกันสนุกๆ', emoji: '🎯', color: 'from-blue-600 to-purple-600', sound: '🕹️', category: 'home' },
    { id: 70, title: '☕ ทำกาแฟสายไหล', description: 'เรียนชงกาแฟแบบมือโปร ลาเต้อาร์ต', emoji: '☕', color: 'from-amber-700 to-orange-700', sound: '🫖', category: 'home' },
    { id: 71, title: '🛋️ จัด Living Room ใหม่', description: 'ย้ายเฟอร์นิเจอร์ ตกแต่งห้องให้สวยขึ้น', emoji: '🪴', color: 'from-green-400 to-lime-400', sound: '🏠', category: 'home' },
    { id: 72, title: '📚 อ่านหนังสือให้กันฟัง', description: 'เลือกหนังสือดีๆ ผลัดกันอ่านให้ฟัง', emoji: '📖', color: 'from-yellow-600 to-amber-600', sound: '🎙️', category: 'home' },
    { id: 73, title: '🎵 Karaoke ที่บ้าน', description: 'เปิดเพลงใน YouTube ร้องกันเต็มที่', emoji: '🎤', color: 'from-pink-500 to-purple-500', sound: '🎶', category: 'home' },
    { id: 74, title: '🧘 Meditation Together', description: 'นั่งสมาธิ ผ่อนคลาย ฟังเพลงเบาๆ', emoji: '🕉️', color: 'from-purple-400 to-indigo-400', sound: '🎵', category: 'home' },
    { id: 75, title: '🌱 ปลูกต้นไม้', description: 'ซื้อต้นไม้ กระถาง มาปลูกตกแต่งบ้าน', emoji: '🪴', color: 'from-green-500 to-emerald-500', sound: '🌿', category: 'home' },
    { id: 76, title: '🧩 ต่อ LEGO', description: 'ซื้อชุด LEGO มาต่อด้วยกัน อาจใช้เวลาหลายวัน', emoji: '🧱', color: 'from-red-500 to-yellow-500', sound: '🎨', category: 'home' },
    { id: 77, title: '🎨 Coloring Book', description: 'ซื้อ coloring book สำหรับผู้ใหญ่ มานั่งระบาย', emoji: '🖍️', color: 'from-pink-400 to-purple-400', sound: '🎨', category: 'home' },
    { id: 78, title: '🍪 Cookie Decorating', description: 'อบคุกกี้ แล้วตกแต่งด้วย frosting สีสวยๆ', emoji: '🍪', color: 'from-amber-500 to-orange-500', sound: '🎀', category: 'home' },
    { id: 79, title: '🎬 Watch Old Home Videos', description: 'ดูวิดีโอเก่าๆ รูปเก่าๆ นึกถึงความหลัง', emoji: '📼', color: 'from-gray-500 to-slate-500', sound: '💝', category: 'home' },
    { id: 80, title: '🧘‍♂️ Couple Workout', description: 'ออกกำลังกายที่บ้าน ช่วยกันทำท่า', emoji: '💪', color: 'from-orange-500 to-red-500', sound: '🏋️', category: 'home' },

    // 🎉 Social & Adventure (20)
    { id: 81, title: '🎳 เล่นโบว์ลิ่ง', description: 'ไปโบว์ลิ่ง แข่งกัน กินของว่างในร้าน', emoji: '🎯', color: 'from-blue-500 to-cyan-500', sound: '🎳', category: 'social' },
    { id: 82, title: '🏐 เล่นกีฬาด้วยกัน', description: 'แบดมินตัน เทนนิส หรือบาสเก็ตบอล', emoji: '🎾', color: 'from-green-500 to-lime-500', sound: '🏀', category: 'social' },
    { id: 83, title: '🎰 ไปคาสิโน', description: 'ถ้าถูกกฎหมาย ไปเล่นเกมส์สนุกๆ (แค่นิดหน่อย)', emoji: '🃏', color: 'from-red-600 to-yellow-600', sound: '💰', category: 'social' },
    { id: 84, title: '🎪 ไปสวนสนุก', description: 'นั่งเครื่องเล่นสุดมันส์ กรี๊ดด้วยกัน', emoji: '🎢', color: 'from-red-500 to-pink-500', sound: '🎡', category: 'social' },
    { id: 85, title: '🏛️ เที่ยวพิพิธภัณฑ์', description: 'ดูศิลปะ ประวัติศาสตร์ เรียนรู้ของใหม่', emoji: '🖼️', color: 'from-gray-600 to-stone-600', sound: '🎨', category: 'social' },
    { id: 86, title: '🎪 ดูโชว์ Stand-up Comedy', description: 'ไปหัวเราะกับการแสดงคอมเมดี้', emoji: '😂', color: 'from-yellow-500 to-orange-500', sound: '🎤', category: 'social' },
    { id: 87, title: '🎨 Art Gallery Hopping', description: 'เที่ยวแกลเลอรี่ศิลปะหลายแห่ง ชมงานศิลป์', emoji: '🖼️', color: 'from-purple-500 to-pink-500', sound: '🎨', category: 'social' },
    { id: 88, title: '🏊 ไป Water Park', description: 'เล่นน้ำ ลื่นสไลด์เดอร์ สนุกเต็มวัน', emoji: '🌊', color: 'from-cyan-400 to-blue-400', sound: '💦', category: 'social' },
    { id: 89, title: '🎪 ไปเที่ยวงานวัด', description: 'เที่ยวงานวัด กินของอร่อย เล่นเกมส์', emoji: '🎡', color: 'from-orange-500 to-red-500', sound: '🍡', category: 'social' },
    { id: 90, title: '🏖️ Beach Volleyball', description: 'เล่นวอลเล่ย์บอลชายหาด สนุกและออกกำลัง', emoji: '🏐', color: 'from-yellow-500 to-orange-500', sound: '🏖️', category: 'social' },
    { id: 91, title: '🎯 Escape Room', description: 'ไปแก้ปริศนา หาทางออกด้วยกัน ท้าทายสมอง', emoji: '🔐', color: 'from-gray-700 to-red-700', sound: '🧩', category: 'social' },
    { id: 92, title: '🎮 VR Gaming', description: 'ลองเล่นเกมส์ VR สุดล้ำ สนุกมันส์', emoji: '🥽', color: 'from-blue-600 to-purple-600', sound: '🎮', category: 'social' },
    { id: 93, title: '🏇 ไปฟาร์ม', description: 'เที่ยวฟาร์มสัตว์ ให้อาหาร ถ่ายรูปน่ารัก', emoji: '🐄', color: 'from-green-600 to-lime-600', sound: '🌾', category: 'social' },
    { id: 94, title: '🎨 Workshop เทียน/สบู่', description: 'เข้าคลาสทำเทียน หรือสบู่หอมๆ', emoji: '🕯️', color: 'from-purple-400 to-pink-400', sound: '🌸', category: 'social' },
    { id: 95, title: '🏙️ City Tour', description: 'เที่ยวเมืองแบบนักท่องเที่ยว ไปจุดท่องเที่ยวดัง', emoji: '🗺️', color: 'from-blue-500 to-indigo-500', sound: '📸', category: 'social' },
    { id: 96, title: '🎨 Graffiti Workshop', description: 'เรียนวาดภาพกราฟฟิตี้ แบบถูกกฎหมาย', emoji: '🎨', color: 'from-pink-600 to-purple-600', sound: '🖌️', category: 'social' },
    { id: 97, title: '🏮 Night Market', description: 'เที่ยวตลาดกลางคืน กินอาหารริมทาง ช้อปปิ้ง', emoji: '🍢', color: 'from-orange-600 to-red-600', sound: '🏮', category: 'social' },
    { id: 98, title: '🎪 Charity Event', description: 'ไปร่วมงานการกุศล ช่วยเหลือสังคมด้วยกัน', emoji: '❤️', color: 'from-red-500 to-pink-500', sound: '🤝', category: 'social' },
    { id: 99, title: '🏛️ Architecture Tour', description: 'เที่ยวชมสถาปัตยกรรมสวย ถ่ายรูปสวยๆ', emoji: '🏰', color: 'from-gray-600 to-blue-600', sound: '📸', category: 'social' },
    { id: 100, title: '🎊 Flash Mob Dance', description: 'เรียนเต้นแล้วไปเต้นที่ที่ชุมชน สนุกมาก!', emoji: '💃', color: 'from-pink-500 to-purple-500', sound: '🕺', category: 'social' },
  ]

  const categories = [
    { id: 'all', name: 'ทั้งหมด', emoji: '🎯', color: 'from-gray-600 to-gray-800' },
    { id: 'food', name: 'อาหาร', emoji: '🍽️', color: 'from-orange-500 to-red-500' },
    { id: 'entertainment', name: 'บันเทิง', emoji: '🎬', color: 'from-purple-500 to-pink-500' },
    { id: 'outdoor', name: 'กลางแจ้ง', emoji: '🏞️', color: 'from-green-500 to-teal-500' },
    { id: 'creative', name: 'สร้างสรรค์', emoji: '🎨', color: 'from-pink-500 to-rose-500' },
    { id: 'home', name: 'ที่บ้าน', emoji: '🏠', color: 'from-amber-500 to-orange-500' },
    { id: 'social', name: 'สังสรรค์', emoji: '🎉', color: 'from-blue-500 to-indigo-500' },
  ]

  const filteredActivities = activities.filter(activity => {
    const matchCategory = selectedCategory === 'all' || activity.category === selectedCategory
    const matchSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  // Touch swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const currentY = e.touches[0].clientY
    const diffY = currentY - touchStart.y

    if (diffY < -50) {
      createHeartExplosion()
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  // Confetti animation
  useEffect(() => {
    if (!canvasRef.current || !showModal) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      rotation: number
      rotationSpeed: number
    }> = []

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 5,
        color: ['#ec4899', '#f43f5e', '#f97316', '#eab308', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 6)],
        size: Math.random() * 10 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3
        p.rotation += p.rotationSpeed
        p.vx *= 0.98

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()

        if (p.y > canvas.height) {
          particles.splice(i, 1)
        }
      })

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [showModal])

  const createHeartExplosion = () => {
    const newHearts = []
    for (let i = 0; i < 30; i++) {
      newHearts.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      })
    }
    setHearts(newHearts)
    setTimeout(() => setHearts([]), 3000)
  }

  const handleChoose = () => {
    // เล่นเพลงเมื่อกดปุ่มสุ่มครั้งแรก
    if (bgMusicRef.current && bgMusicRef.current.paused) {
      bgMusicRef.current.play().catch((error) => {
        console.log('Auto-play prevented:', error)
      })
    }

    setIsLoading(true)
    setTimeout(() => {
      const filtered = selectedCategory === 'all'
        ? activities
        : activities.filter(a => a.category === selectedCategory)
      const randomIndex = Math.floor(Math.random() * filtered.length)
      setSelectedActivity(filtered[randomIndex])
      setIsLoading(false)
      setShowModal(true)

      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    }, 1500)
  }

  const checkSecret = () => {
    // รหัสลับที่เป็นวันที่พิเศษของคุณ
    const secret1 = process.env.NEXT_PUBLIC_SECRET_1
    const secret2 = process.env.NEXT_PUBLIC_SECRET_2

    if (secretInput === secret1 || secretInput === secret2) {
      // 1. ปลดล็อกสถานะและแสดง Modal พิเศษ
      setUnlocked(true)
      setShowSecret(false)
      setShowUnlockModal(true)

      createHeartExplosion()

      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200])
      }

      // หมายเหตุ: เพลง Taylor Swift จะยังคงเล่นต่อเนื่องไปเรื่อยๆ ตามที่คุณต้องการ

    } else {
      // กรณีใส่รหัสผิด: ให้ช่อง Input สั่น (Shake Animation) และแจ้งเตือน
      setShakeSecret(true)
      setTimeout(() => setShakeSecret(false), 500)
      setSecretInput('')
    }
  }

  const handleHeaderClick = () => {
    setClickCount(prev => prev + 1)
    if (clickCount >= 6) {
      setEasterEgg(true)
      createHeartExplosion()
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50, 50, 50])
      }
      setTimeout(() => {
        setEasterEgg(false)
        setClickCount(0)
      }, 3000)
    }
  }

  const handleCardClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowModal(true)
    createHeartExplosion()
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-rose-100 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-24 h-24 md:w-32 md:h-32 bg-pink-300 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-32 h-32 md:w-40 md:h-40 bg-rose-300 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 md:w-36 md:h-36 bg-red-300 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />

      {hearts.map(heart => (
        <div
          key={heart.id}
          className="fixed text-3xl md:text-4xl pointer-events-none z-50 animate-heart-float"
          style={{ left: `${heart.x}%`, top: `${heart.y}%`, animationDelay: `${heart.delay}s` }}
        >
          ❤️
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-block cursor-pointer select-none active:scale-95 transition-transform"
            onClick={handleHeaderClick}
          >
            <h1 className="text-6xl md:text-8xl mb-3 transition-all duration-300 animate-bounce-slow">
              💝
            </h1>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 mb-3 animate-gradient-x drop-shadow-lg">
            วาเลนไทน์นี้
          </h2>

          <p className="text-2xl md:text-3xl text-rose-500 font-bold mb-4">
            100 ไอเดียทำอะไรดี?
          </p>

          {/* Secret Button */}
          <button
            onClick={() => setShowSecret(!showSecret)}
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full text-rose-600 font-medium text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 border-2 border-rose-300 mb-4"
          >
            <span className="text-lg">🔒</span>
            <span>รหัสลับของเรา</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${showSecret ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSecret && !unlocked && (
            <div className={`mb-6 animate-slide-down ${shakeSecret ? 'animate-shake' : ''}`}>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border-2 border-rose-200 max-w-sm mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">💝</span>
                  <p className="text-rose-600 font-bold text-base">ใส่รหัสลับ</p>
                  <span className="text-2xl">💝</span>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="password"
                    inputMode="numeric"
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••••"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-rose-300 focus:border-rose-500 outline-none text-center font-mono text-lg bg-white font-bold text-rose-900 placeholder-rose-300"
                    onKeyPress={(e) => e.key === 'Enter' && checkSecret()}
                    maxLength={8}
                    autoComplete="off"
                  />
                  <button
                    onClick={checkSecret}
                    className="px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl active:scale-95 transition-all font-bold shadow-lg text-lg"
                  >
                    ✓
                  </button>
                </div>

                <div className="bg-rose-50 rounded-lg p-3 border border-rose-200">
                  <p className="text-xs text-rose-500 flex items-center gap-2">
                    <span>💡</span>
                    <span>Hint: วันที่พิเศษของเรา (8 หลัก)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="🔍 ค้นหากิจกรรม..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-400 outline-none text-base bg-white/80 backdrop-blur-sm"
          />

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all active:scale-95 ${selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Random Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleChoose}
            disabled={isLoading}
            className={`relative bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white px-10 py-5 rounded-full text-xl font-black shadow-2xl transition-all duration-300 w-full max-w-md ${isLoading ? 'opacity-90 cursor-wait' : 'active:scale-95 hover:shadow-3xl'
              }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>กำลังสุ่ม...</span>
                </>
              ) : (
                <>
                  <span>สุ่มให้หน่อย!</span>
                </>
              )}
            </span>

            {!isLoading && (
              <>
                <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-30"></div>
                <div className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-20" style={{ animationDelay: '0.3s' }}></div>
              </>
            )}
          </button>
          <p className="text-rose-400 mt-3 text-xs">
            มี {filteredActivities.length} กิจกรรม{selectedCategory !== 'all' && ` ใน ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Result Modal */}
        {showModal && selectedActivity && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden border-4 border-rose-200 max-w-2xl w-full animate-modal-bounce"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 flex items-center justify-center transition-all active:scale-95 z-10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 border-t-4 border-l-4 border-rose-400 rounded-tl-2xl md:rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 border-t-4 border-r-4 border-rose-400 rounded-tr-2xl md:rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 border-b-4 border-l-4 border-rose-400 rounded-bl-2xl md:rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 border-b-4 border-r-4 border-rose-400 rounded-br-2xl md:rounded-br-3xl"></div>

              <div className="relative z-10">
                <div className="text-6xl md:text-7xl mb-6 animate-bounce">{selectedActivity.emoji}</div>
                <h3 className="text-3xl md:text-4xl font-black text-rose-600 mb-6 animate-wiggle">
                  คำตอบคือ...
                </h3>
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-6 md:py-8 px-6 md:px-8 rounded-2xl mb-6 shadow-lg">
                  <p className="text-3xl md:text-4xl font-black mb-3 drop-shadow-lg">{selectedActivity.title}</p>
                  <p className="text-base md:text-lg opacity-95">{selectedActivity.description}</p>
                </div>

                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={handleChoose}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
                  >
                    สุ่มใหม่
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all"
                  >
                    ไปกันเลย!
                  </button>
                </div>

                <p className="text-rose-400 text-sm mt-4">
                  หรือจะเลือกกิจกรรมอื่นก็ได้นะ
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unlock Secret Modal */}
        {showUnlockModal && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end md:items-center justify-center animate-fade-in"
            onClick={() => setShowUnlockModal(false)}
          >
            <div
              className="bg-gradient-to-b from-rose-50 to-rose-100 w-full h-[90vh] md:h-auto md:max-h-[85vh] md:max-w-xl md:rounded-3xl rounded-t-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-modal-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar - ปรากฏเฉพาะบน Mobile */}
              <div className="w-12 h-1.5 bg-rose-300/40 rounded-full mx-auto my-4 md:hidden flex-shrink-0"></div>

              {/* Close button - ปรับตำแหน่งให้เหมาะสมทุกอุปกรณ์ */}
              <button
                onClick={() => setShowUnlockModal(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-md active:scale-90 transition-all z-20 hover:bg-rose-50"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* เนื้อหาภายใน - จัดการเรื่อง Scroll ให้ Responsive */}
              <div className="flex-1 overflow-y-auto px-6 md:px-10 py-2 custom-scrollbar">
                <div className="text-center relative z-10 py-4">
                  <div className="text-5xl md:text-6xl mb-4 animate-bounce-slow">🌹</div>
                  <h3 className="text-2xl md:text-3xl font-black text-rose-800 mb-2 leading-tight">
                    ยินดีด้วยนะคนเก่ง...
                  </h3>
                  <p className="text-rose-500 font-bold mb-8 italic text-sm md:text-base">รหัสลับถูกปลดล็อกแล้ว</p>

                  {/* Text Body - ปรับ Line Height และขนาดตัวอักษรตามหน้าจอ */}
                  <div className="text-[15px] md:text-lg text-rose-700 leading-relaxed md:leading-loose space-y-6 text-left font-medium">
                    <p>
                      ถ้าปลดมาได้แสดงว่าเธอก็เก่งเหมือนกันนิน้า ถึงเราจะไม่ได้เป็นอะไรกันแล้วแต่ก็ยังคอยตามดูชีวิตเธออยู่นะ
                      อยากให้มีความสุขเยอะๆ อยากให้ยิ้มเยอะๆ ก็ไม่รู้นะว่าเวลาของเราจะเดินตรงกันอีกตอนไหน
                      แต่ว่าถ้าวันนึงเวลาของเรากลับมามีโอกาสเดินตรงกันอีกครั้ง <span className="font-bold text-rose-900 underline decoration-rose-300 underline-offset-4">สัญญาว่าครั้งนี้จะไม่ปล่อยให้มันจบแบบเดิม</span>
                    </p>

                    <p>
                      เพราะช่วงเวลาที่ผ่านมามันทำให้เรารู้ว่า การมีอยู่ของเธอมันมีค่ามากขนาดไหน ถึงแม้ตอนนี้สถานะของเราจะเปลี่ยนไป
                      แต่ความหวังดีที่เคยให้เธอก็ไม่เคยลดลงเลยนะ เรายังคงภูมิใจในตัวเธอเสมอ ไม่ว่าเธอจะไปเจอเรื่องที่เหนื่อยล้า
                      หรือเรื่องที่ทำให้ยิ้มได้ เราก็ยังยืนยันคำเดิมว่า <span className="text-rose-900 font-extrabold italic">"อยากให้เธอมีความสุขที่สุด"</span>
                    </p>

                    <p>
                      ในวันที่เราไม่ได้คุยกันเหมือนเมื่อก่อน เราก็ได้เรียนรู้ที่จะเติบโตขึ้นในที่ของตัวเอง ได้ทบทวนสิ่งต่างๆ ที่เคยผ่านมา
                      และถ้าโชคชะตาอยากให้เรากลับมาเริ่มกันใหม่จริงๆ <span className="text-rose-800 font-bold border-b-2 border-rose-200">เราจะกลับมาดูแลเธอให้ดีที่สุด</span> เท่าที่คนคนหนึ่งจะทำได้
                    </p>

                    <p>
                      แต่ถ้าสุดท้ายแล้วเส้นทางของเรามันต้องเป็นเส้นขนานที่มองเห็นกันได้แต่บรรจบกันไม่ได้จริงๆ เราก็ไม่เสียใจเลยนะที่ครั้งหนึ่งเคยมีเธออยู่ในชีวิต
                      ขอบคุณที่เป็นส่วนหนึ่งของความทรงจำที่สวยที่สุดของเรา...
                    </p>

                    <div className="pt-8 border-t border-rose-200/60 text-center">
                      <p className="text-rose-600 mb-2 italic text-sm md:text-base opacity-90">
                        จนกว่าจะถึงวันนั้นที่เวลาของเราตรงกัน <br />
                        หรือจนกว่าความสุขของเธอจะนำทางเธอไปในจุดที่ใจเธอต้องการ
                      </p>
                      <p className="text-rose-900 font-black text-xl md:text-2xl mt-4 leading-tight">
                        ดูแลตัวเองดีๆ นะคนเก่ง <br />
                        รักเสมอและจะคอยซัพพอร์ตเธออยู่ตรงนี้ตลอดไป
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Button - ฟิกซ์ไว้ด้านล่างเสมอ */}
              <div className="p-6 md:px-10 md:pb-10 bg-gradient-to-t from-rose-50 via-rose-50 to-transparent flex-shrink-0">
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold shadow-rose-200 shadow-lg hover:shadow-rose-300 hover:scale-[1.02] active:scale-95 transition-all text-lg md:text-xl"
                >
                  เริ่มเลือกกิจกรรมกันเลย ✨
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={`bg-gradient-to-br ${activity.color} p-6 rounded-2xl shadow-xl active:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden active:scale-95`}
              onClick={() => handleCardClick(activity)}
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-active:translate-x-[100%] transition-transform duration-1000"></div>

              <div className="absolute top-3 right-3 w-7 h-7 bg-white/30 rounded-full flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm">
                {activity.id}
              </div>

              <div className="relative z-10">
                <div className="text-4xl mb-3 group-active:scale-125 group-active:rotate-12 transition-all duration-300">
                  {activity.emoji}
                </div>
                <h3 className="text-white font-bold text-base mb-2 line-clamp-2">
                  {activity.title}
                </h3>
                <p className="text-white/90 text-sm line-clamp-2">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">😅</p>
            <p className="text-xl text-rose-500">ไม่เจอกิจกรรมที่ตรงกับการค้นหา</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-full active:scale-95 transition-all"
            >
              ดูทั้งหมด
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <div className="flex justify-center gap-1 mb-4 flex-wrap">
            {[...Array(7)].map((_, i) => (
              <span
                key={i}
                className="text-2xl animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                💖
              </span>
            ))}
          </div>
          <p className="text-rose-500 font-bold text-lg">Happy Valentine's Day 2026</p>
          <p className="text-rose-400 text-sm">Made with love</p>
          <p className="text-rose-300 text-xs">100 ไอเดีย</p>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes heart-float {
          0% { transform: translateY(0) scale(0); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-bounce {
          0% { opacity: 0; transform: scale(0.5) translateY(-100px); }
          60% { transform: scale(1.05) translateY(0); }
          80% { transform: scale(0.95) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-gradient-x { 
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-heart-float { animation: heart-float 1.5s ease-out forwards; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-modal-bounce { animation: modal-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-wiggle { animation: wiggle 1s ease-in-out; }
      `}</style>
    </div>
  )
}