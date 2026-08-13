const getRandomPrice = () => Math.floor(Math.random() * 1000) + 100;
const getRandomString = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 7)}`;
export class BookingPayloads {
  

    static createValidBooking() {
      return {
        firstname: getRandomString('User'),
        lastname: getRandomString('Tester'),
        totalprice: getRandomPrice(),
        depositpaid: Math.random() < 0.5,
        bookingdates: {
          checkin: '2026-11-01',
          checkout: '2026-11-05'
        },
        additionalneeds: 'Breakfast'
      };
    }
    static createInvalidBooking() {
        return {
          firstname: '', // Пустое имя для проверки ошибки сервера
          lastname: 'Tester',
          totalprice: -100 // Отрицательная цена
        };
      }
    }