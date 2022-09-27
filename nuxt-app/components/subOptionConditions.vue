<template>
    <ClientOnly>
        <el-row class="card-content">
            <el-col :span="4">
                <span>サブOP条件</span>
            </el-col>
            <el-col :span="20">
                <el-select
                    v-model="subOps"
                    value-key="key"
                    multiple
                    :multiple-limit="4"
                    placeholder=" "
                    class="input-sub-option"
                >
                    <el-option
                        v-for="item in subOptions"
                        :key="item"
                        :label="item.label"
                        :value="item"
                        :disabled="item.key===props.mainOp.key"
                    >
                        <span style="float: left">{{ item.label }}</span>
                        <span
                            style="
                                float: right;
                                color: var(--el-text-color-secondary);
                                font-size: 11px;
                                margin-right: 10px;
                            "
                        >
                            <template v-if="item.key === props.mainOp.key || subOps.find(sub => sub.key === item.key)">selected</template>
                            <template v-else-if="subOps.length < 4">{{ (item.prob * 100 / unSelectedToltalProb).toFixed(2) }} %</template>
                        </span>
                    </el-option>
                </el-select>
                <span> の </span>
                <el-select
                    v-model="logic"
                    class="input-logic"
                >
                    <el-option
                        v-for="item in logicList"
                        :key="item.key"
                        :label="item.label"
                        :value="item.key"
                    />
                </el-select>
            </el-col>
        </el-row>
        <el-row class="card-content">
            <el-col :span="4"/>
            <el-col :span="20">
                <el-tooltip
                    class="box-item"
                    effect="light"
                    placement="right-end"
                    :content="'4オプション聖遺物は部位・メインOP・サブOPに関わらす一律'+op4Prob+'%で出現するとした場合'"
                >
                    <el-checkbox
                        v-model="allowOp3"
                        label="ドロップ時にサブオプションが３つだけの聖遺物を含む"
                        size="large"
                        v-on:change="chainAllowLeveling"
                    />
                </el-tooltip>
            </el-col>
        </el-row>
        <el-row class="card-content">
            <el-col :span="4"/>
            <el-col :span="20">
                <el-checkbox
                    v-model="allowLeveling"
                    label="４レベルで追加される４つ目のサブオプションを条件に含む"
                    size="large"
                    :disabled="!allowOp3"
                />
            </el-col>
        </el-row>
    </ClientOnly>
</template>

<style>
    .input-sub-option {
        width: 300px;
    }
    .input-logic {
        width: 200px;
    }

</style>

<script lang="ts" setup>
    import { c } from 'unimport/dist/types-43c63a16';
import { Ref } from 'vue';
    import { artifactTypes, subOptions, op4Prob } from '../const/index'

    interface Props {
        mainOp: Ref
        rollMap: Ref
    }
    const props = withDefaults(defineProps<Props>(), {
        mainOp: artifactTypes[0].mainOptions[0],
        rollMap: [],
    })
    const logicList = [
        {key: 'all', label: 'すべてを含む'},
        {key: 'get1', label: 'うち１つ以上を含む'},
        {key: 'get2', label: 'うち２つ以上を含む'},
        {key: 'get3', label: 'うち３つ以上を含む'},
    ]

    // Data
    const subOps = ref([]);
    const logic = ref(logicList[0].key);
    const allowOp3 = ref(true)
    const allowLeveling = ref(true)

    // Computed
    const unSelectedToltalProb = computed(() => {
        const unSelectedOptions =  subOptions.filter(op => !(props.mainOp && props.mainOp.key === op.key) && !subOps.value.find(sub => sub.key === op.key))
        // console.log(subOps.value, unSelectedOptions);
        return unSelectedOptions.reduce((sum, op) => sum + op.prob, 0)
    })
    const totalProb = computed(() => {

        return 1;
    })

    // Method
    const chainAllowLeveling = () => {
        allowLeveling.value = allowOp3.value
    }

    const checkProb = (roll: object): number => {

        let prob = 0
        let r3Count = 0
        let r4Count = 0
        subOps.value.forEach(op => {
            if (roll.r3List.includes(op.key)) {
                r3Count++
            }
            if (roll.r4List.includes(op.key)) {
                r4Count++
            }
        })

        if (checkLogic(r3Count)) {
            if (allowOp3.value) {
                prob = roll.prob
            } else {
                prob = roll.prob * op4Prob / 100
            }
        }
        else if (checkLogic(r4Count)) {
            if (allowOp3.value && allowLeveling.value) {
                prob = roll.prob
            } else {
                prob = roll.prob * op4Prob / 100
            }
        }

        return prob
    }

    const checkLogic = (count: number) => {
        switch(logic.value) {
            case 'all':
                return (count >= subOps.value.length)
                break
            case 'get1':
                return  (count >= 1)
                break
            case 'get2':
                return  (count >= 2)
                break
            case 'get3':
                return  (count >= 3)
                break
            default:
                return false
        }
    }

    const removeDuplicate = (key: string) => {
        const index = subOps.value.findIndex(n => n.key === key)
        if (index >= 0) {
            subOps.value.splice(index, 1);
        }
    }

    defineExpose({ checkProb, removeDuplicate })

</script>
