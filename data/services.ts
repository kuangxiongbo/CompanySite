
export const serviceContentData = {
    overview: {
        title: "服务概述",
        description: "奥联科技秉承“客户至上、服务为本”的理念，建立了一套完善的售后服务体系。我们提供5×9小时的日常服务响应，以及针对特定需求的7×24小时全天候保障，确保客户业务系统的安全稳定运行。",
    },
    basicServices: {
        title: "基础服务",
        items: [
            {
                title: "硬件质保与更换",
                description: "提供硬件产品的免费质保服务。在质保期内，非人为损坏的硬件故障，我们将提供免费维修或更换服务。",
                icon: "Hardware"
            },
            {
                title: "技术咨询与培训",
                description: "提供电话、邮件、在线等多种方式的技术咨询。同时为客户提供产品使用、管理及维护的专业培训。",
                icon: "Consulting"
            },
            {
                title: "故障排查与修复",
                description: "当系统出现故障时，我们提供远程诊断和现场支持，快速定位问题并进行修复，最大程度降低业务影响。",
                icon: "Troubleshooting"
            }
        ]
    },
    valueAddedServices: {
        title: "增值服务",
        items: [
            {
                title: "日常运维与巡检",
                description: "定期对系统进行健康检查和性能评估，提前发现潜在风险，确保系统长期处于最佳运行状态。",
                subItems: ["深度巡检", "定制化巡检", "巡检报告"]
            },
            {
                title: "重大节假日保障",
                description: "在国家法定节假日或客户重大活动期间，提供专人值守和应急响应服务，保障系统安全无忧。",
                subItems: ["节前检查", "节假日值守", "应急预案"]
            },
            {
                title: "应急演练与恢复",
                description: "协助客户制定应急预案，并定期组织实战演练。在发生灾难性事件时，协助进行数据恢复和系统重建。",
                subItems: ["应急演练", "灾难恢复", "演练报告"]
            },
            {
                title: "密评配合与取证",
                description: "提供基于国密标准的合规性检测和咨询，配合完成商用密码应用安全性评估，确保障号系统及数据传输符合国家相关标准。",
                subItems: ["密评配合", "安全取证", "合规咨询"]
            },
            {
                title: "环境迁移与扩容",
                description: "当客户业务扩展需要迁移数据中心或扩容系统时，提供全程技术支持，确保数据完整性和业务连续性。",
                subItems: ["环境迁移", "系统扩容", "方案与测试"]
            },
            {
                title: "软件升级与补丁",
                description: "提供软件版本的持续更新和升级服务，确保客户始终能够使用到最新的功能特性和安全补丁。",
                subItems: ["版本升级", "安全补丁", "安全基线"]
            }
        ]
    }
};

export const downloadData = {
    products: [
        {
            id: "mijiu-mail",
            name: "密九邮",
            description: "安全电子邮件客户端，支持移动端和PC端，提供端到端加密保护。",
            updated: "2025.08.25",
            platforms: [
                { os: "Android", link: "#", version: "v2.5.3" },
                { os: "Windows", link: "#", version: "v3.1.0" }
            ],
            image: "mail_icon.png"
        },
        {
            id: "mijiu-tong",
            name: "密九通",
            description: "安全网络通话与即时通讯应用，保障您的每一次沟通安全。",
            updated: "2025.08.25",
            platforms: [
                { os: "Android", link: "#", version: "v2.1.0" },
                { os: "Windows", link: "#", version: "v2.0.5" }
            ],
            image: "tong_icon.png"
        },
        {
            id: "access-client",
            name: "安全接入客户端",
            description: "专为内网安全接入设计的VPN/网关客户端，支持多种认证方式。",
            updated: "2025.08.25",
            platforms: [
                { os: "Windows", link: "#", version: "v4.2.1" },
                { os: "MacOS", link: "#", version: "v4.2.1" }
            ],
            image: "vpn_icon.png"
        }
    ]
};
