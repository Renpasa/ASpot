import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // 1. 建立一個假帳號 (密碼為 password123)
    const password_hash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            username: 'testuser',
            password_hash,
            // 2. 順便幫他發布幾個打卡點
            photoSpots: {
                create: [
                    {
                        title: '台北 101 經典機位',
                        lat: 25.033964,
                        lng: 121.564468,
                        photo_url: 'https://images.unsplash.com/photo-1543884849-0abcb65c1973?auto=format&fit=crop&q=80&w=300&h=200',
                        best_time: '黃昏或晚上點燈後',
                        composition_tips: '使用廣角鏡頭，可帶入前景的車軌'
                    },
                    {
                        title: '北車大廳黑白棋盤格',
                        lat: 25.047924,
                        lng: 121.517081,
                        photo_url: 'https://images.unsplash.com/photo-1572979261314-874e50eb9dd0?auto=format&fit=crop&q=80&w=300&h=200',
                        best_time: '平假日皆可',
                        composition_tips: '從二樓往下俯拍可以拍出幾何感'
                    }
                ]
            }
        }
    });
    console.log('✅ 資料庫播種完成！', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });