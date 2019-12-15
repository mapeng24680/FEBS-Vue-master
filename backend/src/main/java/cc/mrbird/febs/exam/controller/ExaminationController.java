package cc.mrbird.febs.exam.controller;

import cc.mrbird.febs.common.annotation.Log;
import cc.mrbird.febs.common.controller.BaseController;
import cc.mrbird.febs.common.domain.QueryRequest;
import cc.mrbird.febs.common.exception.FebsException;
import cc.mrbird.febs.exam.domain.Examination;
import cc.mrbird.febs.exam.service.ExaminationService;
import cc.mrbird.febs.system.domain.Dept;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.Map;

/**
 * @author pengpeng
 * @version 1.0.0
 * @description: 试题模块
 * @since 2019/12/7 21:20
 */
@Slf4j
@Validated
@RestController
@RequestMapping("examination")
public class ExaminationController extends BaseController {
    private String message;
    @Autowired
    private ExaminationService examinationService;

    @GetMapping("sort")
    public Map<String,Object> querySort(QueryRequest request) {
        return this.examinationService.findSorts(request);
    }

    @Log("新增考试分类")
    @PostMapping
    @RequiresPermissions("sort:add")
    public void addExam(@Valid Examination examination) throws FebsException {
        try {
            this.examinationService.createExam(examination);
        } catch (Exception e) {
            message = "新增试题分类失败";
            log.error(message, e);
            throw new FebsException(message);
        }
    }

    @Log("删除考试分类")
    @DeleteMapping("/{sortIds}")
    @RequiresPermissions("sort:delete")
    public void deleteDepts(@NotBlank(message = "{required}") @PathVariable String sortIds) throws FebsException {
        try {
            String[] ids = sortIds.split(StringPool.COMMA);
            this.examinationService.deleteExams(ids);
        } catch (Exception e) {
            message = "删除考试分类";
            log.error(message, e);
            throw new FebsException(message);
        }
    }

    @Log("修改考试分类")
    @PutMapping
    @RequiresPermissions("sort:update")
    public void updateDept(@Valid Examination examination) throws FebsException {
        try {
            this.examinationService.updateExam(examination);
        } catch (Exception e) {
            message = "修改考试分类";
            log.error(message, e);
            throw new FebsException(message);
        }
    }


}
