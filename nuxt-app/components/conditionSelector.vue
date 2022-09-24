<template>
    <div>
        <ClientOnly>
            <div>
                <span>種類</span>
                <el-select
                    v-model="artifact"
                    v-on:change="clear"
                >
                    <el-option
                        v-for="item in artifactTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </div>
            <div>
                <span>メインオプション</span>
                <el-select
                    v-model="main"
                    :disabled="artifact==1||artifact==2"
                >
                    <template v-for="a in artifactTypes" >
                        <template v-if="a.value == artifact">
                            <el-option
                                v-for="item in a.mainOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </template>
                    </template>
                </el-select>
            </div>
            <div>
                <span>サブオプション条件</span>
                <el-select
                    v-model="subs"
                    multiple
                    :multiple-limit="3"
                    style="width: 240px"
                >
                    <el-option
                        v-for="item in subOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.value===main"
                    />
                </el-select>
            </div>
        </ClientOnly>
    </div>
</template>

<script lang="ts" setup>
    import { assertExportDefaultDeclaration } from '@babel/types';
import { ref } from 'vue';
    const artifact=ref(1);
    const main=ref(1);
    const subs=ref([]);
    const artifactTypes = [
        {value: 1, label: '花', mainOptions:[
            {value: 1,  prob: 100, label: 'HP+',},
        ]},
        {value: 2, label: '羽', mainOptions:[
            {value: 3,  prob: 100, label: '攻撃力+',},
        ]},
        {value: 3, label: '砂', mainOptions:[
            {value: 2,  prob: 80/3, label: 'HP%',},
            {value: 4,  prob: 80/3, label: '攻撃力%',},
            {value: 6,  prob: 80/3, label: '防御力%',},
            {value: 7,  prob: 10, label: '元素熟知',},
            {value: 8,  prob: 10, label: '元素チャージ効率',},
        ]},
        {value: 4, label: '杯', mainOptions:[
            {value: 2,  prob: 19.175, label: 'HP%',},
            {value: 4,  prob: 19.175, label: '攻撃力%',},
            {value: 6,  prob: 19.15, label: '防御力%',},
            {value: 7,  prob: 2.5, label: '元素熟知',},
            {value: 11, prob: 5, label: '物理・属性ダメージ',},
        ]},
        {value: 5, label: '冠', mainOptions:[
            {value: 2,  prob: 22, label: 'HP%',},
            {value: 4,  prob: 22, label: '攻撃力%',},
            {value: 6,  prob: 22, label: '防御力%',},
            {value: 7,  prob: 4, label: '元素熟知',},
            {value: 9,  prob: 10, label: '会心率',},
            {value: 10, prob: 10, label: '会心ダメージ',},
            {value: 12, prob: 10, label: '治癒効果',},
        ]},
    ];
    const subOptions = [
        {value: 1,  prob: 15, label: 'HP+',},
        {value: 2,  prob: 10, label: 'HP%',},
        {value: 3,  prob: 15, label: '攻撃力+',},
        {value: 4,  prob: 10, label: '攻撃力%',},
        {value: 5,  prob: 15, label: '防御力+',},
        {value: 6,  prob: 10, label: '防御力%',},
        {value: 7,  prob: 10, label: '元素熟知',},
        {value: 8,  prob: 10, label: '元素チャージ効率',},
        {value: 9,  prob: 7.5, label: '会心率',},
        {value: 10, prob: 7.5, label: '会心ダメージ',},
    ];

    const clear = () => {
        if (artifact.value == 1 ) {
            main.value = 1;
        }
        else if (artifact.value == 2) {
            main.value = 3;
        }
        else {
            main.value = null;
        }
        subs.value = [];
    }
</script>