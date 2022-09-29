<template>
    <el-card class="card-sub-option">
        <el-row>
            <el-col :span="19">
                <div class="check-box-sub-option">
                    <ClientOnly>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            placement="right-end"
                            :content="'4オプション聖遺物は部位・メインOP・サブOPに関わらす一律'+op4Prob+'%で出現するとした場合'"
                        >
                            <el-checkbox
                                v-model="subCards[props.index].allowOp3"
                                label="ドロップ時にサブオプションが３つだけの聖遺物を含む"
                                v-on:change="chainAllowLeveling"
                            />
                        </el-tooltip>
                        <el-checkbox
                            v-model="subCards[props.index].allowLeveling"
                            label="４レベルで追加される４つ目のサブオプションを条件に含む"
                            :disabled="!subCards[props.index]?.allowOp3"
                        />
                    </ClientOnly>
                </div>
            </el-col>
            <el-col :span="5">
            <div class="prob-box">
                <el-space wrap>
                    <span> {{(totalProb).toFixed(4)}} %</span>
                    <el-button
                        :icon="Delete"
                        size="small"
                        circle
                        v-on:click="deleteThis"
                    />
                </el-space>
            </div>
        </el-col>
        </el-row>
        <el-row>
            <el-col :span="11">
                <ClientOnly>
                    <el-select
                        v-model="subCards[props.index].subOps"
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
                                <template v-if="item.key === props.mainOp.key || subCards[props.index].subOps.find(sub => sub.key === item.key)">selected</template>
                                <template v-else-if="subCards[props.index].subOps.length < 4">{{ (item.prob * 100 / unSelectedToltalProb).toFixed(2) }} %</template>
                            </span>
                        </el-option>
                    </el-select>
                </ClientOnly>
            </el-col>
            <el-col :span="13">
                <span> の </span>
                <ClientOnly>
                    <el-select
                        v-model="subCards[props.index].logic"
                        class="input-logic"
                    >
                        <el-option
                            v-for="item in logicList"
                            :key="item.key"
                            :label="item.label"
                            :value="item.key"
                        />
                    </el-select>
                </ClientOnly>
            </el-col>
        </el-row>
    </el-card>
</template>

<style>
.input-sub-option {
    width: 300px;
}
.input-logic {
    width: 200px;
}

.prob-box {
    float: right;
}
.check-box-sub-option {
    margin-bottom: 5px;
}
.check-box-sub-option .el-checkbox {
    --el-checkbox-checked-text-color: var(--el-text-color-regular);
}
</style>

<script lang="ts" setup>
    import { Ref } from 'vue';
    import { artifactTypes, subOptions, op4Prob } from '../const/index'
    import { Delete } from '@element-plus/icons-vue'

    interface Props {
        mainOp: Ref
        rollMap: Ref
        index: number
    }
    const props = withDefaults(defineProps<Props>(), {
        mainOp: artifactTypes[0].mainOptions[0],
        rollMap: [],
        index: 0,
    })
    const logicList = [
        {key: 'all', label: 'すべてを含む'},
        {key: 'get1', label: 'うち１つ以上を含む'},
        {key: 'get2', label: 'うち２つ以上を含む'},
        {key: 'get3', label: 'うち３つ以上を含む'},
    ]

    // Data
    const subCards = useSubCards()

    // Computed
    const unSelectedToltalProb = computed(() => {
        const unSelectedOptions =  subOptions.filter(op => !(props.mainOp && props.mainOp.key === op.key) && !subCards[props.index].subOps.find(sub => sub.key === op.key))
        return unSelectedOptions.reduce((sum, op) => sum + op.prob, 0)
    })

    const totalProb = computed(() => {

        const mainProb = props.mainOp.prob / 100
        let subProb = 0

        props.rollMap?.forEach(roll => {
            subProb += checkProb(roll, props.index)
        })
        // console.log('subProb',subProb)

        return mainProb * subProb;
    })

    // Method
    const chainAllowLeveling = () => {
        subCards[props.index].allowLeveling = subCards[props.index].allowOp3
    }

    const deleteThis = () => {
        deleteSubCard(props.index)
    }

</script>
