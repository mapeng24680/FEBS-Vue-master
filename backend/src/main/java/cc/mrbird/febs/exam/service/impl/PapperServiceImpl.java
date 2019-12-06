package cc.mrbird.febs.exam.service.impl;

import cc.mrbird.febs.exam.dao.PapperMapper;
import cc.mrbird.febs.exam.domain.Papper;
import cc.mrbird.febs.exam.service.PapperService;
import cc.mrbird.febs.system.dao.DeptMapper;
import cc.mrbird.febs.system.domain.Dept;
import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author huihui
 * @version 1.0
 * @date 2019/12/6 22:41
 * @remark 描述
 */
@Slf4j
@Service("papperService")
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true, rollbackFor = Exception.class)
public class PapperServiceImpl extends ServiceImpl<PapperMapper, Papper> implements PapperService  {

}
