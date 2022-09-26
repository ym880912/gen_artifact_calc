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
                    style="width: 500px"
                    placeholder=" "
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
                                margin-right: 30px;
                            "
                        >
                            <template v-if="item.key === props.mainOp.key || subOps.find(sub => sub.key === item.key)">selected</template>
                            <template v-else-if="subOps.length < 4">{{ (item.prob * 100 / unSelectedToltalProb).toFixed(2) }} %</template>
                        </span>
                    </el-option>
                </el-select>
                <span> をすべて含む</span>
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

<script lang="ts" setup>
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

    // Data
    const subOps=ref([]);
    const allowOp3=ref(true)
    const allowLeveling=ref(true)

    // Computed
    const unSelectedToltalProb = computed(() => {
        const unSelectedOptions =  subOptions.filter(op => !(props.mainOp && props.mainOp.key === op.key) && !subOps.value.find(sub => sub.key === op.key))
        // console.log(subOps.value, unSelectedOptions);
        return unSelectedOptions.reduce((sum, op) => sum + op.prob, 0)
    })

    const chainAllowLeveling = () => {
        allowLeveling.value = allowOp3.value
    }

    const totalProb = computed(() => {

        return 1;
    })

    const checkProb = (roll: object): number => {

        let prob = 0
        let includes = true
        subOps.value.forEach(op => {
            includes = includes && roll.r3List.includes(op.key)
        })
        if (includes) {
            if (allowOp3.value) {
                prob = roll.prob
            } else {
                prob = roll.prob * op4Prob /100
            }
        } else {
            let r4includes = true
            subOps.value.forEach(op => {
                r4includes = r4includes && roll.r4List.includes(op.key)
            })
            if (r4includes) {
                if (allowOp3.value && allowLeveling.value) {
                    prob = roll.prob
                } else {
                    prob = roll.prob * op4Prob /100
                }
            }
        }

        return prob
    }

    defineExpose({ checkProb })

</script>
