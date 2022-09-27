<template>
    <el-card class="card-main">
        <ClientOnly>
            <el-row class="result-row">
                <span>ドロップ期待値</span>
            </el-row>
            <el-row class="result-row">
                <el-col :span="11" :offset="1">
                    <span>秘境周回</span>
                </el-col>
                <el-col :span="12">
                    <template v-if="props.totalProb != 0"><span>{{resinExpected.toFixed(0)}} 天然樹脂</span></template>
                    <template v-else>-- 天然樹脂</template>
                </el-col>
            </el-row>
            <el-row class="result-row">
                <el-col :span="11" :offset="1">
                    <span>聖遺物回生</span>
                </el-col>
                <el-col :span="12">
                    <template v-if="props.totalProb != 0"><span>{{strongBoxExpected.toFixed(2)}} 回</span></template>
                    <template v-else>-- 回</template>
                </el-col>
            </el-row>
            <el-divider border-style="double" />
            <el-row class="result-row">
                    <span>出現確率</span>
            </el-row>
            <el-row class="result-row">
                <el-col :span="11" :offset="1">
                    <span>同セット内</span>
                </el-col>
                <el-col :span="12">
                    <span>{{(props.totalProb / 5 > 0.01) ? (props.totalProb / 5).toFixed(2) : (props.totalProb / 5).toFixed(4)}} %</span>
                </el-col>
            </el-row>
            <el-row class="result-row">
                <el-col :span="11" :offset="1">
                    <span>同部位内</span>
                </el-col>
                <el-col :span="12">
                    <span>{{(props.totalProb > 0.01) ? (props.totalProb).toFixed(2) : (props.totalProb).toFixed(4)}} %</span>
                </el-col>
            </el-row>
        </ClientOnly>
    </el-card>
</template>

<style>
.result-row {
    margin: 7px 0px;
}
</style>

<script lang="ts" setup>
    interface Props {
        totalProb: number
    }
    const props = withDefaults(defineProps<Props>(), {
        totalProb: 100
    })

    // Computed
    const resinExpected  = computed(() => {
        return 40 * 5 * 100 / props.totalProb
    })
    const strongBoxExpected = computed(() => {
        return 5 * 100 / props.totalProb
    })

</script>