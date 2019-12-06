package cc.mrbird.febs.exam.controller;

import cc.mrbird.febs.common.annotation.Log;
import cc.mrbird.febs.common.controller.BaseController;
import cc.mrbird.febs.common.exception.FebsException;
import cc.mrbird.febs.exam.domain.Papper;
import cc.mrbird.febs.exam.service.PapperService;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * @author huihui
 * @version 1.0
 * @date 2019/12/6 22:30
 * @remark 试卷
 */
@Slf4j
@Validated
@RestController
@RequestMapping("papper")
public class PapperController extends BaseController {

    private String message;

    @Autowired
    private PapperService papperService;

    @Log("新增试卷")
    @PostMapping
    @RequiresPermissions("papper:add")
    public void addUser(@Valid Papper papper) throws FebsException {
        try {
            this.papperService.save(papper);
        } catch (Exception e) {
            message = "新增试卷失败";
            log.error(message, e);
            throw new FebsException(message);
        }
    }
}
