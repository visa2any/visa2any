
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'visa2any@gmail.com';
    const newPassword = 'ChangeMe123!';

    try {
        console.log(`Searching for user: ${email}...`);
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error(`User ${email} not found! Run seed_admin.js first.`);
            return;
        }

        console.log(`User found. Resetting password...`);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                role: 'ADMIN', // Ensure they are admin while we are at it
                isActive: true
            },
        });

        console.log(`✅ SUCCESS: Password for ${email} has been reset to: ${newPassword}`);

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
