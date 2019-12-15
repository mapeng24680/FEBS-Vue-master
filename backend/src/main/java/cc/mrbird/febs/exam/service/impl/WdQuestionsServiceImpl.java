package cc.mrbird.febs.exam.service.impl;

import cc.mrbird.febs.exam.dao.WdQuestionsMapper;
import cc.mrbird.febs.exam.domain.WdQuestions;
import cc.mrbird.febs.exam.service.IWdQuestionsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * 问答题
 * @author pengpeng
 */
@Service
public class WdQuestionsServiceImpl extends ServiceImpl<WdQuestionsMapper, WdQuestions> implements IWdQuestionsService {

}
