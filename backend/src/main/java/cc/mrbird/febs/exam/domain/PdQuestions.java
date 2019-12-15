package cc.mrbird.febs.exam.domain;

import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * 判断试题表
 *
 * @author pengpeng
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PdQuestions implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 所属试题模块id
     */
    private Integer examinationId;

    /**
     * 试题名称
     */
    private String questionName;

    /**
     * 试题答案 0-正确 1-错误
     */
    private Integer answer;

    /**
     * 该试题是否开启 0-开启 1-关闭
     */
    private Integer status;

    /**
     * 试题是否删除0-未删除 1-删除
     */
    private Integer isDelete;

    /**
     * 新增时间
     */
    private LocalDateTime insertTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 操作员
     */
    private String operationUser;

    /**
     * 操作员名称
     */
    private String operationName;

    /**
     * 试题备注（解析等）
     */
    private String remark;

    /**
     * 试题等级 0-简单 1-普通 2-困难
     */
    private Integer queLevel;


}
