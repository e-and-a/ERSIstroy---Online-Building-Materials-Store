export type DemoDialog = {
  id: string;
  participantName: string;
  lastMessage: string;
  unreadCount: number;
};

export type DemoMessage = {
  id: string;
  author: string;
  text: string;
  sentAt: string;
  isOwn: boolean;
};

const dialogs: DemoDialog[] = [
  {
    id: "manager",
    participantName: "Менеджер ERSI",
    lastMessage: "Подтвердили наличие и отправили расчет.",
    unreadCount: 1
  },
  {
    id: "logistics",
    participantName: "Логистика",
    lastMessage: "Доставка возможна завтра с 10:00 до 13:00.",
    unreadCount: 0
  },
  {
    id: "support",
    participantName: "Техподдержка",
    lastMessage: "Для уточнения укажите номер заказа.",
    unreadCount: 2
  }
];

const messagesByDialogId: Record<string, DemoMessage[]> = {
  manager: [
    {
      id: "m1",
      author: "Менеджер ERSI",
      text: "Здравствуйте. Проверили позиции по вашей заявке.",
      sentAt: "09:12",
      isOwn: false
    },
    {
      id: "m2",
      author: "Вы",
      text: "Отлично, подскажите финальную стоимость.",
      sentAt: "09:14",
      isOwn: true
    },
    {
      id: "m3",
      author: "Менеджер ERSI",
      text: "Подтвердили наличие и отправили расчет.",
      sentAt: "09:18",
      isOwn: false
    }
  ],
  logistics: [
    {
      id: "l1",
      author: "Логистика",
      text: "Доступны окна доставки на завтра.",
      sentAt: "11:00",
      isOwn: false
    },
    {
      id: "l2",
      author: "Вы",
      text: "Подходит первая половина дня.",
      sentAt: "11:02",
      isOwn: true
    },
    {
      id: "l3",
      author: "Логистика",
      text: "Доставка возможна завтра с 10:00 до 13:00.",
      sentAt: "11:05",
      isOwn: false
    }
  ],
  support: [
    {
      id: "s1",
      author: "Техподдержка",
      text: "Добрый день. Уточните номер заказа для проверки.",
      sentAt: "15:20",
      isOwn: false
    },
    {
      id: "s2",
      author: "Вы",
      text: "Номер заказа: 4721.",
      sentAt: "15:22",
      isOwn: true
    },
    {
      id: "s3",
      author: "Техподдержка",
      text: "Спасибо, проверяем информацию по заказу.",
      sentAt: "15:24",
      isOwn: false
    }
  ]
};

export function getDemoDialogs() {
  return dialogs;
}

export function getDemoDialogById(id: string) {
  return dialogs.find((dialog) => dialog.id === id) ?? null;
}

export function getDemoMessagesByDialogId(id: string) {
  return messagesByDialogId[id] ?? [];
}
