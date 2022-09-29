export const artifactTypes = [
    {key: 'flower', label: '生の花', mainOptions:[
        {key: 'h+', prob: 100, label: 'HP+(固定)',},
    ]},
    {key: 'wing', label: '死の羽', mainOptions:[
        {key: 'a+', prob: 100, label: '攻撃力+(固定)',},
    ]},
    {key: 'sand', label: '時の砂', mainOptions:[
        {key: 'h%', prob: 80/3, label: 'HP%',},
        {key: 'a%', prob: 80/3, label: '攻撃力%',},
        {key: 'd%', prob: 80/3, label: '防御力%',},
        {key: 'em', prob: 10, label: '元素熟知',},
        {key: 'er', prob: 10, label: '元素チャージ効率',},
    ]},
    {key: 'cup', label: '空の杯', mainOptions:[
        {key: 'db', prob: 5, label: '元素・物理ダメージ',},
        {key: 'h%', prob: 19.175, label: 'HP%',},
        {key: 'a%', prob: 19.175, label: '攻撃力%',},
        {key: 'd%', prob: 19.15, label: '防御力%',},
        {key: 'em', prob: 2.5, label: '元素熟知',},
    ]},
    {key: 'crown', label: '理の冠', mainOptions:[
        {key: 'cr', prob: 10, label: '会心率',},
        {key: 'cd', prob: 10, label: '会心ダメージ',},
        {key: 'h%', prob: 22, label: 'HP%',},
        {key: 'a%', prob: 22, label: '攻撃力%',},
        {key: 'd%', prob: 22, label: '防御力%',},
        {key: 'em', prob: 4, label: '元素熟知',},
        {key: 'hb', prob: 10, label: '治癒効果',},
    ]},
];

export const subOptions = [
    {key: 'cr', prob: 7.5, label: '会心率',},
    {key: 'cd', prob: 7.5, label: '会心ダメージ',},
    {key: 'h%', prob: 10, label: 'HP%',},
    {key: 'a%', prob: 10, label: '攻撃力%',},
    {key: 'd%', prob: 10, label: '防御力%',},
    {key: 'em', prob: 10, label: '元素熟知',},
    {key: 'er', prob: 10, label: '元素チャージ効率',},
    {key: 'h+', prob: 15, label: 'HP+',},
    {key: 'a+', prob: 15, label: '攻撃力+',},
    {key: 'd+', prob: 15, label: '防御力+',},

];

export const op4Prob = 40