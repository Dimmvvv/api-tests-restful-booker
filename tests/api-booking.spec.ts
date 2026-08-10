import { test, expect, request } from '@playwright/test';

// 1. Описываем группу тестов
test.describe('Проверка бронирований', () => {

  // 2. Создаем сам тест (асинхронную функцию). 
  // Объект { request } внутри круглых скобок — это встроенный в Playwright "инструмент", 
  // который умеет делать HTTP-запросы. Playwright сам дает его нам.
  test('Успешное получение конкретной брони', async ({ request }) => {
    
    // ДЕЙСТВИЕ: Говорим инструменту request: "Сделай GET-запрос на этот адрес".
    // Ждем (await), пока сервер ответит, и сохраняем всё в переменную response.
    const response = await request.get('/booking/1');

    // ПРОВЕРКА 1: Проверяем, что сервер ответил успешно (код 200)
    expect(response.status()).toBe(200);

    // ДЕЙСТВИЕ 2: Извлекаем из ответа чистые данные (JSON) в виде обычного объекта JS.
    // Это тоже занимает время, поэтому пишем await.
    const body = await response.json();

    // ПРОВЕРКА 2: Проверяем, что внутри объекта в поле firstname лежит строка.
    // Метод toHaveProperty проверяет, что такое свойство вообще есть в объекте.
    expect(body).toHaveProperty('firstname');
  });
  test('Проверка типов данных', async ({ request }) => {
    const response = await request.get('/booking/2');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.totalprice).toBe('number');
    expect(typeof body.firstname).toBe('string');
  });
  test('Фильтрация по данным', async ({request}) => {
    const response = await request.get('/booking?checkin=2014-03-13');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });
  test('Проверка вложенного объекта', async ({request}) => {
    const response = await request.get('/booking/5');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingdates');
    expect(body.bookingdates).toHaveProperty('checkin');
    expect(body.bookingdates).toHaveProperty('checkout');
  });   
  test('Негативный тест на несуществующий ID', async ({request}) => {
    const response = await request.get('booking/99999');
    expect(response.status()).toBe(404);
  });
  test('Математическая проверка стоимости', async ({request}) =>{
const response = await request.get('booking/5');
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.totalprice).toBeGreaterThan(0);
  });
});
