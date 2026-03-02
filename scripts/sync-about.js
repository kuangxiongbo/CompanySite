import fs from 'fs';
import path from 'path';

/**
 * About Content Sync Skill
 * 
 * This script ensures 100% character-perfect replication of "About" pages 
 * from the official site (cs.new.myibc.net).
 * It uses the data extracted from the site to maintain consistency.
 */

const aboutData = {
    profile: {
        descriptions: [
            '深圳奥联信息安全技术有限公司（以下简称“奥联”）始于2002年，是集算法研制、产品研发、方案实现、标准制定、前瞻性技术研究为一体，具备国际领先的密码领域全面“智造”能力的综合型密码安全企业。奥联是我国SM9、ECS算法的主要原研及标准制定单位，国家级专精特新“小巨人”企业，已承接10个国家部委的重大信息安全专项/课题，与西安电子科技大学合作成立“西电密码研究中心”，与西电广研院合作成立“密码技术及应用创新实验室”，在北京、陕西、湖南、贵州、安徽、浙江等区域设立分子公司。',
            '奥联在IBC标识密码技术研究和应用上处于国际领先水平，具备全密码算法设计能力和密码产品研发能力，自主或参与设计的多个标识密码算法已被ISO、IEEE、3GPP和IETF等国际标准组织采纳为标准算法；目前已主导或参与了国际标准7项、国家标准7项、行业标准15项、团体标准7项的制定工作，拥有54项密码有关发明专利、27项商用密码产品认证证书及信创产品证书、多项公安部计算机安全专用产品销售许可证。在算法方面，奥联是国家SM9算法重要的原研及标准编制单位，积极推动SM9成为第一个全体系进入ISO的非对称国际算法；牵头编制《基于SM2算法的无证书及隐式证书公钥机制》，该密码系统可广泛应用于车联网、工业互联网等领域；物联网方面，联合中国电信、华为编制的X.1365《在电信网络上使用基于身份的密码来支持物联网服务的安全方法》获国际电信联盟（ITU）正式发布，填补国际空白；在政务数据共享方面，牵头制定《信息安全技术 政务信息共享 数据安全技术要求》国家标准正式发布。',
            '奥联基于SM2/3/4/9/ZUC国密算法的密码产品及解决方案、轻量级密钥体系及安全中间件，如传统政企（密码资源池、安全邮件、安全接入、移动加密通讯、身份认证、海外通讯、安全微政务等）、物联网（物联网安全平台、NB模组、加密芯片、视频监控系统安全）、工业互联网（工控安全、工业互联网标识解析安全）、数据安全（数据库加解密系统、数据安全服务平台、存储安全）、车联网（V2X车联网安全）等已成功应用于国家部委、企事业单位、电信运营商、金融机构、海外中资机构等单位。'
        ],
        attributes: [
            { label: '国际标准', value: '7项' },
            { label: '国家标准', value: '7项' },
            { label: '行业标准', value: '15项' },
            { label: '发明专利', value: '54项' },
        ],
        environmentImages: [
            '/upload/about/environment/env_01.png',
            '/upload/about/environment/env_02.png',
            '/upload/about/environment/env_03.png',
            '/upload/about/environment/env_04.png',
            '/upload/about/environment/env_05.png',
            '/upload/about/environment/env_06.png',
            '/upload/about/environment/env_07.png',
            '/upload/about/environment/env_08.png',
            '/upload/about/environment/env_09.png',
            '/upload/about/environment/env_10.png',
            '/upload/about/environment/env_11.png',
            '/upload/about/environment/env_12.png',
            '/upload/about/environment/env_13.png',
        ],
        advantages: [
            { title: 'SM9/ECS原研单位', desc: '中国SM9标识密码算法和ECS无证书密码系统的发明及标准化主体单位' },
            { title: '国际标准参与者', desc: 'ISO/IEC 18033-5、ISO/IEC 14888-3等国际标准起草单位' },
            { title: '全栈产品能力', desc: '覆盖密码基础设施、密码管理、数据安全等全领域产品线' },
            { title: '专精特新小巨人', desc: '国家级专精特新“小巨人”企业，承接10个国家部委重大课题' },
        ],
        stats: [
            { label: '始于', value: '2002年' },
            { label: '专精特新', value: '小巨人' },
            { label: '国家课题', value: '10+' },
            { label: '专利技术', value: '100+' },
        ]
    },
    history: [
        { year: '2023', event: '获批成立“广东省轻量级密码应用工程技术研究中心”；牵头编制的《基于SM2算法的无证书及隐式证书公钥机制》行业标准正式发布，为推动车联网密码算法的国产化替代提供技术支撑。' },
        { year: '2022', event: '入选国家级专精特新“小巨人”企业。' },
        { year: '2021', event: '“SM9标识加密算法”和“密钥协商协议”ISO/IEC国际标准正式发布，SM9算法成为中国首个全体系纳入国际标准的非对称密码算法。' },
        { year: '2020', event: '作为主要贡献单位编制的 X.1365《在电信网络上使用基于身份的密码来支持物联网服务的安全方法》 获国际电信联盟（ITU）正式发布，填补国际空白。' },
        { year: '2019', event: '《基于标准算法的高效无证书密码系统ECS》通过国家密码管理局安全性论证；《SM9标识密码算法》正式成为国家标准。' },
        { year: '2017', event: 'SM2和SM9数字签名算法成功纳入ISO/IEC国际标准。' },
        { year: '2016', event: '《SM9标识密码算法》行业标准正式发布。' },
        { year: '2009', event: '深圳奥联信息安全技术有限公司正式注册成立。' },
        { year: '2008', event: '提交的标识密码算法获国家密码管理局通过并正式颁发SM9算法型号。' },
        { year: '2005', event: '首批获得国家密码管理局商用密码产品生产定点单位证书、商用密码产品销售许可证。' },
        { year: '2002', event: '奥联科技在深圳成立。' },
    ],
    honors: [
        { title: '国家级专精特新“小巨人”企业', category: '企业荣誉' },
        { title: '国家高新技术企业', category: '企业资质' },
        { title: '信息安全管理体系认证 (ISO/IEC 27001)', category: '管理体系' },
        { title: '质量管理体系认证 (ISO 9001)', category: '管理体系' },
        { title: '信息安全服务资质认证 (CCRC)', category: '行业资质' },
        { title: '能力成熟度模型集成 (CMMI Level 3)', category: '研发能力' },
        { title: '广东省轻量级密码应用工程技术研究中心', category: '科研平台' },
        { title: '商用密码产品生产定点单位', category: '行业资质' },
    ],
    contact: {
        address: '深圳市宝安中心区宝兴路6号海纳百川大厦B座16楼',
        phone: '0755-86182108',
        email: 'service@myibc.net',
        workHours: '周一至周五 9:00 - 18:00',
        branches: [
            { name: '北京分部', address: '北京市海淀区西直门大街甲43号金运大厦B-207' },
            { name: '西北分部', address: '西安市雁塔区唐延路11号禾盛京广B座1107' },
            { name: '湖南分部', address: '长沙市岳麓区潇湘南路一段182号奥克斯中心S1栋1105' },
        ]
    }
};

function sync() {
    console.log('Synchronizing "About" content with 100% precision...');
    const targetFile = path.resolve('data/about.ts');

    let content = fs.readFileSync(targetFile, 'utf-8');

    // Generate new content
    const newProfileContent = `export const profileData = {
    companyName: '深圳奥联信息安全技术有限公司',
    descriptions: ${JSON.stringify(aboutData.profile.descriptions, null, 8)},
    attributes: ${JSON.stringify(aboutData.profile.attributes, null, 8)},
    environmentImages: ${JSON.stringify(aboutData.profile.environmentImages, null, 8)},
    advantages: ${JSON.stringify(aboutData.profile.advantages, null, 8)},
    stats: ${JSON.stringify(aboutData.profile.stats, null, 8)},
    logo: '/upload/about/profile/logo.png',
    banner: '/upload/about/profile/banner.png'
};`;

    // Replace Profile
    content = content.replace(/export const profileData = \{[\s\S]*?banner: '[\s\S]*?'\s*\};\s*/, newProfileContent + '\n\n');

    // Update History
    content = content.replace(/export const historyData = \[\s*[\s\S]*?\];/,
        `export const historyData = ${JSON.stringify(aboutData.history, null, 4)};`);

    // Update Honors
    content = content.replace(/export const honorsData = \[\s*[\s\S]*?\];/,
        `export const honorsData = ${JSON.stringify(aboutData.honors, null, 4)};`);

    // Update Contact
    content = content.replace(/export const contactData = \{[\s\S]*?branches: \[[\s\S]*?\]\s*\};/,
        `export const contactData = ${JSON.stringify(aboutData.contact, null, 4)};`);

    fs.writeFileSync(targetFile, content);
    console.log('Successfully updated About content from Skill-extracted data.');
}

sync();
