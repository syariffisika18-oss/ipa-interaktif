const { test, expect } = require('@playwright/test');

for (const device of [
  { name: 'desktop', viewport: {width:1280,height:800} },
  { name: 'mobile', viewport: {width:390,height:844}, isMobile:true, hasTouch:true }
]) {
  test.describe(device.name, () => {
    test.use({viewport:device.viewport,isMobile:!!device.isMobile,hasTouch:!!device.hasTouch});
    test('loads every stage without uncaught JavaScript exceptions',async ({page})=>{
      const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto('http://127.0.0.1:8765/kelas-8/sistem-pencernaan/index.html?_reset=1');
      await expect(page.locator('#organRoute button')).toHaveCount(8);
      await expect(page.locator('#evalOptions button')).toHaveCount(4);
      await expect(page.locator('#nutrientTabs [data-nutrient]')).toHaveCount(3);
      await expect(page.locator('[data-panel]')).toHaveCount(7);
      expect(errors).toEqual([]);
    });
    test('Engage choice and Explore visit survive reload',async ({page})=>{
      await page.goto('http://127.0.0.1:8765/kelas-8/sistem-pencernaan/index.html?_reset=1');
      await page.locator('#predictionOptions [data-prediction]').first().click({force:true});
      await page.locator('#organRoute [data-organ="4"]').click({force:true});
      const choice=await page.locator('#predictionOptions [data-prediction].is-selected').getAttribute('data-prediction');
      await page.goto('http://127.0.0.1:8765/kelas-8/sistem-pencernaan/index.html');
      await expect(page.locator('#predictionOptions [data-prediction="'+choice+'"]')).toHaveClass(/is-selected/);
      await expect(page.locator('#organRoute [data-organ="4"]')).toHaveClass(/is-visited/);
    });
  });
}