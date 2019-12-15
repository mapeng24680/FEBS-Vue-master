package cc.mrbird.febs.exam.service;

import cc.mrbird.febs.common.domain.QueryRequest;
import cc.mrbird.febs.exam.domain.Examination;
import cc.mrbird.febs.system.domain.Dept;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * @author pengpeng
 */
public interface ExaminationService extends IService<Examination> {
    /**
     * 查询试题分类
     *
     * @param request
     * @return
     */
    Map<String, Object> findSorts(QueryRequest request);

    List<Examination> findSort(QueryRequest request);

    /**
     * 新建试题分类
     *
     * @param examination
     */
    void createExam(Examination examination);

    /**
     * 更新试题分类
     *
     * @param examination
     */
    void updateExam(Examination examination);

    /**
     * 删除试题分类
     *
     * @param examinaIds
     */
    void deleteExams(String[] examinaIds);

}
