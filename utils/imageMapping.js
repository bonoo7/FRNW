// ملف لتعيين أسماء الصور إلى مسارات الصور المستوردة
// هذا يسمح لنا باستخدام أسماء الملفات فقط في بيانات الأسئلة

// استيراد جميع الصور بشكل ثابت
const imageMapping = {
  // ملفات GIF
  '1.gif': require('../assets/images/questions/1.gif'),
  '2.gif': require('../assets/images/questions/2.gif'),
  '3.gif': require('../assets/images/questions/3.gif'),
  '5.gif': require('../assets/images/questions/5.gif'),
  '10.gif': require('../assets/images/questions/10.gif'),
  '50.gif': require('../assets/images/questions/50.gif'),
  '100.gif': require('../assets/images/questions/100.gif'),
  '1000.gif': require('../assets/images/questions/1000.gif'),
  
  // ملفات JPG و PNG
  'Dark_Souls_.jpg': require('../assets/images/questions/Dark_Souls_.jpg'),
  'Ghost_of_Tsushima.jpg': require('../assets/images/questions/Ghost_of_Tsushima.jpg'),
  'God_of_War_.jpg': require('../assets/images/questions/God_of_War_.jpg'),
  'Grand_Theft_Auto_V.jpg': require('../assets/images/questions/Grand_Theft_Auto_V.jpg'),
  'Minecraft.jpg': require('../assets/images/questions/Minecraft.jpg'),
  'RE4.jpg': require('../assets/images/questions/RE4.jpg'),
  'REVillage.jpg': require('../assets/images/questions/REVillage.jpg'),
  'SPmilesmorales.jpg': require('../assets/images/questions/SPmilesmorales.jpg'),
  'a short hike.jpg': require('../assets/images/questions/a short hike.jpg'),
  'apex legend.jpg': require('../assets/images/questions/apex legend.jpg'),
  'assasin creed valhala.jpg': require('../assets/images/questions/assasin creed valhala.jpg'),
  'baba is you.jpg': require('../assets/images/questions/baba is you.jpg'),
  'bastion.jpg': require('../assets/images/questions/bastion.jpg'),
  'buldersGaye3.jpg': require('../assets/images/questions/buldersGaye3.jpg'),
  'celeste.jpg': require('../assets/images/questions/celeste.jpg'),
  'cities skyline.jpg': require('../assets/images/questions/cities skyline.jpg'),
  'civilization.jpg': require('../assets/images/questions/civilization.jpg'),
  'cod.jpg': require('../assets/images/questions/cod.jpg'),
  'control.jpg': require('../assets/images/questions/control.jpg'),
  'counter strike 2.jpg': require('../assets/images/questions/counter strike 2.jpg'),
  'cuphead.jpg': require('../assets/images/questions/cuphead.jpg'),
  'Cyberpunk_2077_box_art.jpg': require('../assets/images/questions/Cyberpunk_2077_box_art.jpg'),
  'dark souls 3.jpg': require('../assets/images/questions/dark souls 3.jpg'),
  'dead cells.jpg': require('../assets/images/questions/dead cells.jpg'),
  'deadbydaylight.jpg': require('../assets/images/questions/deadbydaylight.jpg'),
  'deadspace.jpg': require('../assets/images/questions/deadspace.jpg'),
  'death standing.jpg': require('../assets/images/questions/death standing.jpg'),
  'diablo4.jpg': require('../assets/images/questions/diablo4.jpg'),
  'disco elesyom.jpg': require('../assets/images/questions/disco elesyom.jpg'),
  'divinity.jpg': require('../assets/images/questions/divinity.jpg'),
  'dontstrave.jpg': require('../assets/images/questions/dontstrave.jpg'),
  'doom eternal.jpg': require('../assets/images/questions/doom eternal.jpg'),
  'dota2.jpg': require('../assets/images/questions/dota2.jpg'),
  'dragon age aquasition.jpg': require('../assets/images/questions/dragon age aquasition.jpg'),
  'duesex.jpg': require('../assets/images/questions/duesex.jpg'),
  'Elden_Ring_Box_art.jpg': require('../assets/images/questions/Elden_Ring_Box_art.jpg'),
  'factorio.jpg': require('../assets/images/questions/factorio.jpg'),
  'fallout new vegas.jpg': require('../assets/images/questions/fallout new vegas.jpg'),
  'fifa23.jpg': require('../assets/images/questions/fifa23.jpg'),
  'Final Fantasy XVI.png': require('../assets/images/questions/Final Fantasy XVI.png'),
  'fire watch.jpg': require('../assets/images/questions/fire watch.jpg'),
  'forza5.jpg': require('../assets/images/questions/forza5.jpg'),
  'frostpunk.jpg': require('../assets/images/questions/frostpunk.jpg'),
  'gris.jpg': require('../assets/images/questions/gris.jpg'),
  'hades.jpg': require('../assets/images/questions/hades.jpg'),
  'halo infinite.jpg': require('../assets/images/questions/halo infinite.jpg'),
  'hogwart legacy.jpg': require('../assets/images/questions/hogwart legacy.jpg'),
  'hollow knight.jpg': require('../assets/images/questions/hollow knight.jpg'),
  'hollowknightsilksong.jpg': require('../assets/images/questions/hollowknightsilksong.jpg'),
  'horizon forbiden west.jpg': require('../assets/images/questions/horizon forbiden west.jpg'),
  'hyperlight.jpg': require('../assets/images/questions/hyperlight.jpg'),
  'imortal phynex.jpg': require('../assets/images/questions/imortal phynex.jpg'),
  'inside.jpg': require('../assets/images/questions/inside.jpg'),
  'interthegenuin.jpg': require('../assets/images/questions/interthegenuin.jpg'),
  'intothebreach.jpg': require('../assets/images/questions/intothebreach.jpg'),
  'isaac.jpg': require('../assets/images/questions/isaac.jpg'),
  'it takes 2.jpg': require('../assets/images/questions/it takes 2.jpg'),
  'kerbal.jpg': require('../assets/images/questions/kerbal.jpg'),
  'lastofus1.jpg': require('../assets/images/questions/lastofus1.jpg'),
  'limbo.jpg': require('../assets/images/questions/limbo.jpg'),
  'mass effect.jpg': require('../assets/images/questions/mass effect.jpg'),
  'metalgearsurvive.jpg': require('../assets/images/questions/metalgearsurvive.jpg'),
  'metro exudos.jpg': require('../assets/images/questions/metro exudos.jpg'),
  'monster hunter world.jpg': require('../assets/images/questions/monster hunter world.jpg'),
  'nier automata.jpg': require('../assets/images/questions/nier automata.jpg'),
  'nighinthewood.jpg': require('../assets/images/questions/nighinthewood.jpg'),
  'nuclearthrone.jpg': require('../assets/images/questions/nuclearthrone.jpg'),
  'ori.jpg': require('../assets/images/questions/ori.jpg'),
  'outer wilds.jpg': require('../assets/images/questions/outer wilds.jpg'),
  'overwatch2.jpg': require('../assets/images/questions/overwatch2.jpg'),
  'oxenfree.jpg': require('../assets/images/questions/oxenfree.jpg'),
  'papersplease.jpg': require('../assets/images/questions/papersplease.jpg'),
  'persona5.jpg': require('../assets/images/questions/persona5.jpg'),
  'pyre.jpg': require('../assets/images/questions/pyre.jpg'),
  'rachet and clank.jpg': require('../assets/images/questions/rachet and clank.jpg'),
  'racine.jpg': require('../assets/images/questions/racine.jpg'),
  'ravenswatch.jpg': require('../assets/images/questions/ravenswatch.jpg'),
  'redded2.jpg': require('../assets/images/questions/redded2.jpg'),
  'reternal.jpg': require('../assets/images/questions/reternal.jpg'),
  'return of the obra dinn.jpg': require('../assets/images/questions/return of the obra dinn.jpg'),
  'riskofrain.jpg': require('../assets/images/questions/riskofrain.jpg'),
  'rocket league.jpg': require('../assets/images/questions/rocket league.jpg'),
  'seaofthiefs.jpg': require('../assets/images/questions/seaofthiefs.jpg'),
  'sek.jpg': require('../assets/images/questions/sek.jpg'),
  'sekiro.jpg': require('../assets/images/questions/sekiro.jpg'),
  'sikero.jpg': require('../assets/images/questions/sikero.jpg'),
  'skyrem.jpg': require('../assets/images/questions/skyrem.jpg'),
  'slaythespire.jpg': require('../assets/images/questions/slaythespire.jpg'),
  'spelunky.jpg': require('../assets/images/questions/spelunky.jpg'),
  'spiderman.jpg': require('../assets/images/questions/spiderman.jpg'),
  'stardewvally.jpg': require('../assets/images/questions/stardewvally.jpg'),
  'starfield.jpg': require('../assets/images/questions/starfield.jpg'),
  'stellaris.jpg': require('../assets/images/questions/stellaris.jpg'),
  'stray.jpg': require('../assets/images/questions/stray.jpg'),
  'subnuatica.jpg': require('../assets/images/questions/subnuatica.jpg'),
  'superMariooddesy.jpg': require('../assets/images/questions/superMariooddesy.jpg'),
  'teraria.jpg': require('../assets/images/questions/teraria.jpg'),
  'the sims 4.jpg': require('../assets/images/questions/the sims 4.jpg'),
  'theelongdark.jpg': require('../assets/images/questions/theelongdark.jpg'),
  'theinvencble.jpg': require('../assets/images/questions/theinvencble.jpg'),
  'theouterworld.jpg': require('../assets/images/questions/theouterworld.jpg'),
  'thestanleyparable.jpg': require('../assets/images/questions/thestanleyparable.jpg'),
  'thewitness.jpg': require('../assets/images/questions/thewitness.jpg'),
  'thiswarofmine.jpg': require('../assets/images/questions/thiswarofmine.jpg'),
  'total war warhammer.jpg': require('../assets/images/questions/total war warhammer.jpg'),
  'transistor.jpg': require('../assets/images/questions/transistor.jpg'),
  'tthemessenger.jpg': require('../assets/images/questions/tthemessenger.jpg'),
  'undertale.jpg': require('../assets/images/questions/undertale.jpg'),
  'whatremainofedith.jpg': require('../assets/images/questions/whatremainofedith.jpg'),
  'witcher3.jpg': require('../assets/images/questions/witcher3.jpg'),
  'wukong.jpg': require('../assets/images/questions/wukong.jpg'),
  'xcom2.jpg': require('../assets/images/questions/xcom2.jpg'),
  'zeldaBOTW.jpg': require('../assets/images/questions/zeldaBOTW.jpg')
};

/**
 * الحصول على مسار الصورة من اسم الملف
 * @param {string} fileName - اسم ملف الصورة
 * @returns {any} - مسار الصورة المستوردة أو null إذا لم يتم العثور عليها
 */
export const getImageFromFileName = (fileName) => {
  // إذا كان المسار يبدأ بـ http أو https (رابط خارجي)
  if (fileName && (fileName.startsWith('http://') || fileName.startsWith('https://'))) {
    return { uri: fileName };
  }
  
  // البحث عن الصورة في كائن التعيين
  if (fileName && imageMapping[fileName]) {
    return imageMapping[fileName];
  }
  
  // إذا لم يتم العثور على الصورة
  console.warn(`Image not found: ${fileName}`);
  return null;
};

export default imageMapping;
