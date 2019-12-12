package cc.mrbird.febs.exam.controller;


import cc.mrbird.febs.common.annotation.Log;
import cc.mrbird.febs.common.exception.FebsException;
import cc.mrbird.febs.exam.domain.Examination;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * 试题维护
 *
 * @author pengpeng
 */
@Slf4j
@Validated
@RestController
@RequestMapping("questions")
public class QuestionsController {
    String message;

    @Log("新增考试分类")
    @PostMapping
    @RequiresPermissions("sort:add")
    public void addExam(@Valid Examination examination) throws FebsException {
        try {

        } catch (Exception e) {
            message = "新增试题失败";
            log.error(message, e);
            throw new FebsException(message);
        }
    }
}
