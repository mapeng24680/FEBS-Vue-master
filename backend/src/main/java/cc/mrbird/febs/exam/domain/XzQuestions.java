package cc.mrbird.febs.exam.domain;

import java.time.LocalDateTime;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * 选择试题
 *
 * @author pengpeng
 */
@Data
@TableName("examination")
public class XzQuestions implements Serializable {

    private static final long serialVersionUID = 1L;
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    /**
     * 所属试题模块id
     */
    private Integer examinationId;

    /**
     * 选择题题目
     */
    @NotBlank(message = "{required}")
    private String questionName;

    /**
     * 选择题选择项
     */
    @NotBlank(message = "{required}")
    private String questionOption;

    /**
     * 是否多选0-单选 1-多选
     */
    @NotNull
    private Integer isCheck;

    /**
     * 选择题答案 多选时逗号分开
     */
    @NotBlank(message = "{required}")
    private String answer;

    /**
     * 备注
     */
    private String remark;

    /**
     * 新增时间
     */
    private LocalDateTime insertTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 操作员编码
     */
    private String operationUser;

    /**
     * 操作员名称
     */
    private String operationName;

    /**
     * 该试题是否开启 0-开启 1-关闭
     */
    private Boolean status;

    /**
     * 试题是否删除0-未删除 1-删除
     */
    private Boolean isDelete;

    /**
     * 试题等级 0-简单 1-普通 2-困难
     */
    private Boolean queLevel;


}
