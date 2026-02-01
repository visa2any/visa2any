
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const adminUser = await prisma.user.findFirst({
            where: {
                role: 'ADMIN',
            },
        });

        if (adminUser) {
            console.log('Super Admin found:', adminUser.email);
        } else {
            console.log('No Super Admin found.');
        }
    } catch (error) {
        console.error('Error checking for admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
